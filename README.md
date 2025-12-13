## Features

- Send text messages to any chat (user, group, channel) via a **Telegram Bot**  
- Optional:
  - **Silent** messages (`disable_notification`)
  - **MarkdownV2** formatting for text
- Send **local files/photos** via `sendPhoto`
- Uses Telegram’s **HTTPS API** directly, no extra tools required
- Authentication via **Bot Token** (from BotFather)

> ⚠️ Note: Telegram’s `sendPhoto` is used without caption.  
> If you want a caption/description, simply trigger an additional **Send Text** command right after **Send Photo**.

---

## Requirements

- A running installation of **Chataigne**
- A **Telegram Bot** created via [@BotFather](https://t.me/BotFather)
- The **chat ID** (e.g. group ID) you want to send messages to
- Internet access on the machine running Chataigne

---

## Installation

1. Clone or download this repository:
   - Download ZIP from GitHub and extract it.
2. Copy the module folder (the one containing `module.json` and `telegramSender.js`) into Chataigne’s **modules folder**:
   - In Chataigne, go to:  
     `File → Open modules folder`
   - Place the module folder there.
3. In Chataigne:
   - Go to `File → Reload custom modules` (or restart Chataigne).
   - Add a new module:
     - Category: **Network**
     - Module: **Telegram Sender**

---

## Module Parameters

In the module inspector you will see:

- **Bot Token**  
  Your Telegram Bot token from BotFather, e.g.:  
  `123456789:AA...`

- **Chat ID**  
  Chat ID (user, group, channel).  
  For groups, this usually looks like: `-1001234567890`.

Both must be set before any command will work.

---

## Commands

### 1. Send Text

Sends a text message via `sendMessage`.

**Callback:** `sendText`

**Parameters:**

- **Text** (`String`)  
  The message text to send.

- **Silent** (`Boolean`)  
  - `false` → normal notification  
  - `true` → `disable_notification = true` (no push sound / less intrusive)

- **Markdown** (`Boolean`)  
  - `false` → plain text  
  - `true` → uses `parse_mode = MarkdownV2`  
    > Be careful: Telegram MarkdownV2 requires proper escaping of special characters.

**Behavior:**

- If *Markdown = false* and *Silent = false*:  
  `chat_id`, `text`
- If *Markdown = false* and *Silent = true*:  
  `chat_id`, `text`, `disable_notification`
- If *Markdown = true* and *Silent = false*:  
  `chat_id`, `text`, `parse_mode = MarkdownV2`
- If *Markdown = true* and *Silent = true*:  
  `chat_id`, `text`, `parse_mode = MarkdownV2`, `disable_notification`

---

### 2. Send Photo

Sends a local file (e.g. a screenshot or photo) via `sendPhoto` using multipart/form-data.

**Callback:** `sendPhoto`

**Parameters:**

- **File Path** (`File`)  
  Path to the local file.  
  In Chataigne this appears as a file picker field.

- **Silent** (`Boolean`)  
  - `false` → normal notification  
  - `true` → `disable_notification = true` for the photo

**Behavior:**

- The module builds a URL like:  
  `https://api.telegram.org/bot<BotToken>/sendPhoto?chat_id=<ChatID>[&disable_notification=true]`
- The file is sent as multipart field `photo` using `local.uploadFile(...)`.
- No caption is added.  
  If you want a description, simply add another **Send Text** command after **Send Photo**.

---

## Typical Usage

### Simple text message

1. Set **Bot Token** and **Chat ID** in the module.
2. In the **Command Tester**:
   - Select **Send Text**
   - Set:
     - `Text = "Show started"`
     - `Silent = false`
     - `Markdown = false`
   - Trigger the command.  
   → The message should appear in your Telegram chat.

### Screenshot + description

1. OBS (or any tool) saves a screenshot to a fixed file path, e.g.:  
   `/Users/you/OBS_Screenshot.png`
2. In Chataigne:
   - Command **Send Photo**:
     - `File Path` → select that screenshot file
     - `Silent = false`
   - Immediately after, trigger **Send Text**:
     - `Text = "Camera 1 – Cue 03"`
     - `Markdown = true` (optional)
     - `Silent = false`

Result in Telegram:

1. Photo message
2. Directly below: text message with your description

---

## Logging & Debugging

The script logs to Chataigne’s logger:

- When the module is loaded
- When commands are called (`sendText`, `sendPhoto`)
- The built URLs, parameters and payloads
- The HTTP responses from Telegram in `dataEvent(...)`

If something does not work:

1. Check that **Bot Token** and **Chat ID** are set correctly.
2. Look for error messages from Telegram in the log (e.g. `{"ok":false,...}`).
3. Verify the machine has internet access and can reach `https://api.telegram.org/`.

---

## License

This module is intended as a convenience wrapper around the official Telegram Bot API for use with Chataigne.  
Use at your own risk and make sure you comply with Telegram’s terms of service and any rate limits.
