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

### 1. 📁 Clone this repository

```bash
git clone https://github.com/your-username/mock-cdn-unity.git
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
```
| Variable       | Description                                |
| -------------- | ------------------------------------------ |
| `PORT`         | Port the server listens on                 |
| `FAILUR_RATE`  | Chance of a request failing (0.0–1.0)      |
| `MIN_LATENCY`  | Minimum latency in milliseconds            |
| `MAX_LATENCY`  | Maximum latency in milliseconds            |
| `RESOURCE_DIR` | Path to your Addressables `ServerData` dir |

### 4. 📦 Build Addressables in Unity
1. In Unity, open <b>Addressables Groups</b> window.
2. Set your group's:
     - Build Path to `RemoteBuildPath` → something like `ServerData/StandaloneWindows64`
     - Load Path to:
       ```arduino
       http://localhost:1234/StandaloneWindows64
       ```
     - On `Linux` platfomr use the `StandaloneLinux64` folder instead
3. Build with: `Addressables` > `Build` > `New Build` > `Default Build Script`

This will populate the `ServerData/` directory with your Addressables catalog and bundles.

### 5. ▶️ Run the mock server
```bash
npm start
```
> You'll see output like:
```bash
Mock CDN running on http://localhost:1234
```
