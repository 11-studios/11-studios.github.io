mod discord;
mod java;
mod launcher;
mod modded;

use chrono::Local;
use launcher::{base_data_dir, ensure_minecraft_layout, valid_username};
use modded::LaunchVersion;
use serde::{Deserialize,Serialize};
use std::{fs, process::Command, time::{Duration,SystemTime,UNIX_EPOCH}};
use tauri::{AppHandle,Emitter,Manager};

#[derive(Debug,Clone,Serialize,Deserialize,Default)]
#[serde(rename_all="camelCase")]
struct Config { username:String, last_version:String }
#[derive(Debug,Clone,Serialize,Deserialize)]
#[serde(rename_all="camelCase")]
struct VersionCache { saved_at:i64, versions:Vec<LaunchVersion> }
#[derive(Debug,Clone,Serialize)]
#[serde(rename_all="camelCase")]
struct Bootstrap { username:String, last_version:String, versions:Vec<LaunchVersion>, cache_stale:bool }
#[derive(Debug,Clone,Serialize)]
struct ProgressEvent { status:String, progress:f64 }
#[derive(Debug,Clone,Serialize)]
#[serde(rename_all="camelCase")]
struct GameExited { exit_code:i32 }

fn config_path()->std::path::PathBuf{base_data_dir().join("config.json")}
fn cache_path()->std::path::PathBuf{base_data_dir().join("versions_cache.json")}
fn load_config()->Config{fs::read(config_path()).ok().and_then(|b|serde_json::from_slice(&b).ok()).unwrap_or_default()}
fn save_config(c:&Config){let _=fs::create_dir_all(base_data_dir());if let Ok(b)=serde_json::to_vec_pretty(c){let _=fs::write(config_path(),b);}}
fn load_cache()->Option<(Vec<LaunchVersion>,Duration)>{let b=fs::read(cache_path()).ok()?;let c:VersionCache=serde_json::from_slice(&b).ok()?;if c.versions.is_empty()||c.saved_at<=0{return None}let age=SystemTime::now().duration_since(UNIX_EPOCH+Duration::from_secs(c.saved_at as u64)).unwrap_or_default();Some((c.versions,age))}
fn save_cache(v:&[LaunchVersion]){if v.is_empty(){return}let c=VersionCache{saved_at:SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_secs() as i64,versions:v.to_vec()};if let Ok(b)=serde_json::to_vec(&c){let _=fs::write(cache_path(),b);}}

#[tauri::command]
fn bootstrap()->Bootstrap{let c=load_config();let (versions,age)=load_cache().unwrap_or_default();Bootstrap{username:c.username,last_version:c.last_version,cache_stale:age>Duration::from_secs(12*3600),versions}}

#[tauri::command]
async fn refresh_versions(app:AppHandle)->Result<Vec<LaunchVersion>,String>{
    tauri::async_runtime::spawn_blocking(move||{
        let p=|status:String,progress:f64|{let _=app.emit("launch-progress",ProgressEvent{status,progress});};
        let v=modded::fetch_launch_versions(Some(&p))?;save_cache(&v);Ok(v)
    }).await.map_err(|e|e.to_string())?
}

#[tauri::command]
fn start_launch(app:AppHandle, selection:LaunchVersion, username:String)->Result<(),String>{
    let username=username.trim().to_string(); if !valid_username(&username){return Err("Oyuncu adı 3–16 karakter olmalı; harf, sayı ve _ kullanılabilir.".into())}
    save_config(&Config{username:username.clone(),last_version:selection.key.clone()});
    tauri::async_runtime::spawn_blocking(move||{
        let progress=|status:String,value:f64|{let _=app.emit("launch-progress",ProgressEvent{status,progress:value});};
        let result=(||->Result<(),String>{
            progress("Hazırlanıyor…".into(),0.04);
            let (_meta,paths,args,_log_cfg,java_exe)=modded::prepare_selection(&selection,&username,Some(&progress))?;
            let _=fs::create_dir_all(&paths.logs);
            let log_path=paths.logs.join(format!("{}_{}.log",Local::now().format("%Y-%m-%d_%H-%M-%S"),launcher::sanitize_id(&selection.profile_id)));
            let out=fs::File::create(&log_path).map_err(|e|e.to_string())?;let err=out.try_clone().map_err(|e|e.to_string())?;
            progress("Minecraft başlatılıyor…".into(),0.96);
            let mut cmd=Command::new(java_exe);cmd.args(args).current_dir(&paths.game_dir).stdout(out).stderr(err);hide_console(&mut cmd);
            let mut child=cmd.spawn().map_err(|e|format!("Minecraft başlatılamadı: {e}"))?;
            progress("Minecraft çalışıyor.".into(),1.0);let _=app.emit("game-started",());if let Some(w)=app.get_webview_window("main"){let _=w.hide();}
            let status=child.wait().map_err(|e|e.to_string())?;let code=status.code().unwrap_or(-1);if let Some(w)=app.get_webview_window("main"){let _=w.show();let _=w.set_focus();}
            let _=app.emit("game-exited",GameExited{exit_code:code});Ok(())
        })();
        if let Err(e)=result{if let Some(w)=app.get_webview_window("main"){let _=w.show();let _=w.set_focus();}let _=app.emit("launch-error",e);}
    });
    Ok(())
}

#[tauri::command]
fn open_data_folder()->Result<(),String>{let p=base_data_dir();fs::create_dir_all(&p).map_err(|e|e.to_string())?;#[cfg(windows)]{Command::new("explorer.exe").arg(&p).spawn().map_err(|e|e.to_string())?;}#[cfg(not(windows))]{Command::new("xdg-open").arg(&p).spawn().map_err(|e|e.to_string())?;}Ok(())}
#[tauri::command] fn minimize_window(app:AppHandle)->Result<(),String>{app.get_webview_window("main").ok_or("pencere bulunamadı")?.minimize().map_err(|e|e.to_string())}
#[tauri::command] fn close_window(app:AppHandle)->Result<(),String>{app.get_webview_window("main").ok_or("pencere bulunamadı")?.close().map_err(|e|e.to_string())}

#[cfg(windows)] fn hide_console(cmd:&mut Command){use std::os::windows::process::CommandExt;cmd.creation_flags(0x08000000);}
#[cfg(not(windows))] fn hide_console(_cmd:&mut Command){}

pub fn run(){
    tauri::Builder::default().setup(|_|{let _=ensure_minecraft_layout(&base_data_dir());discord::start();Ok(())})
        .invoke_handler(tauri::generate_handler![bootstrap,refresh_versions,start_launch,open_data_folder,minimize_window,close_window])
        .run(tauri::generate_context!()).expect("11_Launcher başlatılamadı");
}
