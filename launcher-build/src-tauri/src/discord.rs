#[cfg(windows)]
mod imp {
    use serde_json::json;
    use std::{fs::{File,OpenOptions},io::Write,thread,time::{Duration,SystemTime,UNIX_EPOCH}};

    const APP_ID: &str = "1516486519953686548";

    fn open_pipe() -> Option<File> {
        for i in 0..10 {
            let name = format!(r"\\.\pipe\discord-ipc-{i}");
            if let Ok(file) = OpenOptions::new().read(true).write(true).open(name) {
                return Some(file);
            }
        }
        None
    }

    fn frame(pipe: &mut File, opcode: u32, payload: serde_json::Value) -> bool {
        let Ok(data) = serde_json::to_vec(&payload) else { return false; };
        let mut header = [0u8; 8];
        header[..4].copy_from_slice(&opcode.to_le_bytes());
        header[4..].copy_from_slice(&(data.len() as u32).to_le_bytes());
        pipe.write_all(&header).is_ok() && pipe.write_all(&data).is_ok()
    }

    fn run_connection(mut pipe: File) {
        if !frame(&mut pipe, 0, json!({"v":1,"client_id":APP_ID})) { return; }
        let start = SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_secs();
        loop {
            let payload = json!({
                "cmd":"SET_ACTIVITY",
                "args":{"pid":std::process::id(),"activity":{"details":"Minecraft Launcher","timestamps":{"start":start}}},
                "nonce":format!("11-launcher-{}",SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_nanos())
            });
            if !frame(&mut pipe, 1, payload) { return; }
            thread::sleep(Duration::from_secs(45));
        }
    }

    pub fn start() {
        thread::spawn(|| loop {
            if let Some(pipe) = open_pipe() { run_connection(pipe); }
            thread::sleep(Duration::from_secs(12));
        });
    }
}

#[cfg(windows)]
pub use imp::start;
#[cfg(not(windows))]
pub fn start() {}
