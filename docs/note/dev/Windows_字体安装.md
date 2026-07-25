# Windows 字体安装

## 一、安装字体

我比较喜欢 Maple Mono 和霞鹜文楷(屏幕阅读版) 这两款字体。其中 Maple Mono 主要用于英文和代码编辑器，而霞鹜文楷等宽(屏幕阅读版) 主要用于显示中文。

### 安装 maple mono 字体

来到 [maple mono](https://github.com/subframe7536/maple-font/releases) release 页面。本文写作时，maple mono 字体版本为 `V7.9`，发布时间为 `2025-12-05`。

下载 **MapleMonoNormalNL-TTF-AutoHint** 版本，得到压缩包并解压。这个版本是纯英文、不带图标库、Windows 原生格式的代码字体。体积很小，缺点是不含中文和图标等字符。
![](../../assets/maple-mono-install.png ':size=800')

`Win + R` 打开"运行"窗口，输入 `fonts`，打开 Windows 字体文件夹。安装该字体时，将解压得到的 .ttf 文件复制到字体文件夹里，或者双击 .ttf 文件一个一个安装。

![](../../assets/Windows_安装字体.png ':size=800')

### 安装霞鹜文楷等宽(屏幕阅读版) 字体

来到 [霞鹜文楷等宽(屏幕阅读版)](https://github.com/lxgw/LxgwWenKai-Screen/releases) release 页面。本文写作时，霞鹜文楷等宽(屏幕阅读版) 字体版本为 `v1.522`，发布时间为 `2026-03-19`。
![](../../assets/LXGWWenKaiScreen-install.png ':size=800')

下载 `LXGWWenKaiScreen.ttf` 与 `LXGWWenKaiMonoScreen.ttf` 两个文件，按上述方法安装。

## 二、查看字体在 Windows 中的名称

打开 PowerShell 执行以下命令：

```powershell
Add-Type -AssemblyName System.Drawing
(New-Object System.Drawing.Text.InstalledFontCollection).Families.Name | Sort-Object
```

该命令会打印所有字体家族名，包括安装的字体。你可以将字体家族名填写到你需要的地方。例如在 VS Code 中，可以填写 `Maple Mono Normal NL, 霞鹜文楷等宽 屏幕阅读版, Consolas, 'Courier New', monospace`

## 三、卸载字体

打开 Windows 字体文件夹，卸载字体只需将其从文件夹中删除即可。如果提示字体文件正在使用，先关闭使用该字体的程序，再删除字体文件。
