function init()
{
    script.log("[Telegram Sender] module loaded");
}

function getBotConfig()
{
    var botTokenParam = local.parameters.getChild("Bot Token");
    var chatIdParam   = local.parameters.getChild("Chat ID");

    if (!botTokenParam)
    {
        script.log("[Telegram Sender] Parameter not found: Bot Token!");
        return null;
    }
	
    if (!chatIdParam)
    {
        script.log("[Telegram Sender] Parameter not found: Chat ID!");
        return null;
    }

    var botToken = botTokenParam.get();
    var chatId   = chatIdParam.get();

    if (!botToken || botToken === "")
    {
        script.log("[Telegram Sender] Bot Token not set!");
        return null;
    }
    if (!chatId || chatId === "")
    {
        script.log("[Telegram Sender] Chat ID not set!");
        return null;
    }

    return {
        botToken: botToken,
        chatId:   chatId
    };
}

// *******************
// SEND TEXT
// *******************

function sendText(text, silent, markdown)
{
    if (!text || text === "")
    {
        script.log("[Telegram Sender] Text not set or empty!");
        return;
    }

    silent   = !!silent;
    markdown = !!markdown;

    var cfg = getBotConfig();
    if (!cfg) return;

    var fullAddress = "bot" + cfg.botToken + "/sendMessage";
    script.log("[Telegram Sender] Send to: " + fullAddress);
    script.log("[Telegram Sender] Text: " + text);
    script.log("[Telegram Sender] Silent: " + silent);
    script.log("[Telegram Sender] Markdown: " + markdown);

    // 1) Plain, nicht silent
    if (!markdown && !silent)
    {
        local.sendPOST(
            fullAddress,
            "chat_id", cfg.chatId,
            "text",    text
        );
    }
    // 2) Plain, silent
    else if (!markdown && silent)
    {
        local.sendPOST(
            fullAddress,
            "chat_id",              cfg.chatId,
            "text",                 text,
            "disable_notification", "true"
        );
    }
    // 3) Markdown, nicht silent
    else if (markdown && !silent)
    {
        local.sendPOST(
            fullAddress,
            "chat_id",    cfg.chatId,
            "text",       text,
            "parse_mode", "MarkdownV2"
        );
    }
    // 4) Markdown + silent
    else
    {
        local.sendPOST(
            fullAddress,
            "chat_id",              cfg.chatId,
            "text",                 text,
            "parse_mode",           "MarkdownV2",
            "disable_notification", "true"
        );
    }
}

// *******************
// SEND PHOTO
// *******************

function sendPhoto(filePath, silent)
{
	if (!filePath || filePath === "")
    {
        script.log("[Telegram Sender] No file path set or empty");
        return;
    }

    silent = !!silent;

    var cfg = getBotConfig();
    if (!cfg) return;

    // URL für sendPhoto – chat_id in der Query, optional disable_notification
    var urlSuffix = "bot" + cfg.botToken + "/sendPhoto?chat_id=" + cfg.chatId;

    if (silent)
    {
        urlSuffix += "&disable_notification=true";
    }

    script.log("[Telegram Sender] Sende Foto to URL: " + urlSuffix);
    script.log("[Telegram Sender] File Path: " + filePath);
    script.log("[Telegram Sender] Silent: " + silent);

    var params = {};
    params.dataType = "json";

    // Name des File-Feldes im Multipart-Form: "photo"
    params.payload = "photo";

    // Lokaler Pfad zur Datei (kommt vom File-Parameter des Commands)
    params.file = filePath;

    // KEINE params.arguments – alles Relevante für das Foto steckt in der URL
    local.uploadFile(urlSuffix, params);
}

// *******************
// RESPONSE 
// *******************

function dataEvent(data, requestURL)
{
    script.log("[Telegram Sender] Received response from: " + requestURL + "\n" + data);
}
