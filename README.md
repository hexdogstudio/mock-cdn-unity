# Mock CDN | Unity
A lightweight mock CDN server for simulating Unity Addressables loading from a remote URL — with optional **latency** and **failure rate** injection to mimic production environments.

---

## 📦 Features

- ✅ Serves Addressables content from a local folder
- 🕒 Adds artificial **latency** to simulate real-world download times
- ❌ Random **failures** to test Addressables error handling
- 🔧 Fully configurable via `.env`

---

> [!NOTE]
> This server is not meant for <b>production</b>, only for <b>local/dev</b> simulation.

## 🚀 Setup Instructions

### 0. 📥 Install Node.js
Download and install Node.js from the official website:<br>
👉 https://nodejs.org/en/download
> ⚠️ Make sure to install the LTS version unless you have a specific reason to use the latest.

You can verify the installation with:
```bash
node -v && npm -v
```

### 1. 📁 Clone this repository

```bash
git clone https://github.com/hexdogstudio/mock-cdn-unity.git
```
### 2. 📦 Enter project folder and install dependencies
```bash
cd mock-cdn-unity/src/ && npm install
```

### 3. 🛠️ Configure `.env`
Adjust the values:
```env
PORT=1234
FAILUR_RATE=0.2
MIN_LATENCY=200
MAX_LATENCY=1500
RESOURCE_DIR=ServerData
VERBOSE=true
```
| Variable       | Description                                |
| -------------- | ------------------------------------------ |
| `PORT`         | Port the server listens on                 |
| `FAILUR_RATE`  | Chance of a request failing (0.0–1.0)      |
| `MIN_LATENCY`  | Minimum latency in milliseconds            |
| `MAX_LATENCY`  | Maximum latency in milliseconds            |
| `RESOURCE_DIR` | Path to your Addressables `ServerData` dir (advisable leave it as it) |
|`VERBOSE`| Enables detailed logs (file scanning, request info, etc.) |

### 4. 📦 Build Addressables in Unity
1. In Unity, open <b>Addressables Groups</b> window.
2. Set your group's:
     - Build Path to:
       ```arduino
       ServerData/[BuildTarget]
       ```
     - Load Path to (use the same port as defined by the `.env`):
       ```arduino
       http://localhost:1234/[BuildTarget]
       ```
3. Build with: `Addressables` > `Build` > `New Build` > `Default Build Script`
4. This will produce the following directory inside your Unity project: `ServerData/StandaloneWindows64`, or similar standalone folder depending on your target build platform.
5. Copy the `ServerData/` directory to the <b>Mock CDN's</b> `src/` directory, now the server can finally deliver your Asset Bundles.

>[!IMPORTANT]
> The limitation of this solution is you have to manually copy the `ServerData/` to the `src/` directory every time you made a new build, since the `RemoteBuildPath` must be a physical folder on the disk.<br>
> Alternativelly you can provide the absolute path of your <b>Mock CDN Server</b> as the `RemoteBuildPath`, for example on linux:<br> `/home/user/servers/mock-cdn-unity/ServerData/[BuildTarget]`

### 5. ▶️ Run the mock server
```bash
npm start
```
> You'll see output like:
```blame
[INIT] Checking resource directory: ServerData
[SCEN] Searching for Asset Bundles...
[FOUND] Asset Bundle at: ServerData/StandaloneLinux64/example.bundle
[OK] Asset Bundle found. Starting server...
[READY] Mock CDN running at http://localhost:1234
```

### 6. 🎮 Use Built Content in Play Mode

To make Unity load assets from the **Mock CDN** instead of the editor's **Asset Database**, do the following:

1. Open the **Addressables Groups** window:  
   `Window > Asset Management > Addressables > Groups`
2. In the top-right corner, find the `Play Mode Script` dropdown.
3. Select: `Use Existing Build`
   
✅ Unity will now load remote-marked assets directly from your **Mock CDN server**, simulating how it will behave in a real build — including any simulated latency or failures.
> [!NOTE]
> Unity will cache remote bundles to minimize external calls, so each bundle is typically fetched only once.  
> You can bypass this by calling `Caching.ClearCache()` explicitly **before** loading your assets.  
> ⚠️ Only use this for testing purposes — clearing the cache at runtime is not recommended in production.

## License
- [MIT](https://choosealicense.com/licenses/mit/)
