# iOS 直连 LinuxDo

> 原标题：iOS 一键配置 DNS，使用始皇的 doh 直连 linux.do
>
> 本文首发于 ：https://linux.do/t/topic/2760519

一直以来我都是开代理上 L 站，以前发过帖但是没有仔细研究过。今天熬穿了索性找找方案。

站内的方案已经很多了，做完发现佬友们已经做过一模一样的了。

- https://linux.do/t/topic/1352136
- https://linux.do/t/topic/2288033
- ...
- 使用 DNSecure 软件实现
- ...

我们只需要用到始皇的 DoH 地址：https://linux.do/t/topic/1150121

---

如果你不想关心那么多，使用 iOS 的设备点开我部署好的 worker 直接下载配置文件： https://dns.shian.kdns.fr （请复制地址使用浏览器打开）

然后去设置的`通用` -> 下翻到最底下的`VPN与设备管理`，点击这个描述文件就可以安装了。 iOS/iPadOS：14.0 及以上应该都是支持的。

如果担心文件安全可以自己部署 worker，代码：

```js
export default {
  async fetch(request) {
    const mobileconfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>DNSSettings</key>
            <dict>
                <key>DNSProtocol</key>
                <string>HTTPS</string>
                <key>ServerURL</key>
                <string>https://baiwan.ddd.oaifree.com:443/query-dns</string>
                <key>SupplementalMatchDomains</key>
                <array>
                    <string>linux.do</string>
                </array>
            </dict>
            <key>PayloadDescription</key>
            <string>Baiwan 自用DNS - 仅 linux.do</string>
            <key>PayloadDisplayName</key>
            <string>Baiwan DNS</string>
            <key>PayloadIdentifier</key>
            <string>com.baiwan.dns.linuxdo</string>
            <key>PayloadOrganization</key>
            <string>Baiwan</string>
            <key>PayloadType</key>
            <string>com.apple.dnsSettings.managed</string>
            <key>PayloadUUID</key>
            <string>0f762990-dbff-4402-a8c7-f1864f33acff</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>Baiwan 自用描述文件</string>
    <key>PayloadDisplayName</key>
    <string>Baiwan DNS</string>
    <key>PayloadIdentifier</key>
    <string>com.baiwan.dns.profile</string>
    <key>PayloadOrganization</key>
    <string>Baiwan</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadScope</key>
    <string>System</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>5aec7058-6605-4924-9563-7509887ba327</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;

    return new Response(mobileconfig, {
      headers: {
        'Content-Type': 'application/x-apple-aspen-config; charset=utf-8',
        'Content-Disposition': 'attachment; filename="baiwan-dns.mobileconfig"',
      },
    });
  },
};
```

速度尚可，一般不会冒盾。这里只让 **`linux.do`** 及其子域名走始皇的 DoH，其他的走系统默认 DNS。

让 AI 查了一下，Apple 的 DNSSettings 支持**多个 DNS 配置同存**，每个配置通过 `SupplementalMatchDomains` 指定负责的域名，[**但前提是它们作用的域名范围不重叠**](https://developer.apple.com/forums/thread/664211)，必须指定作用域名。如果有一个没有指定，或者说它包含了另一个 dns 的作用域名，虽然不会报错，但是并没办法生效。不清楚是被覆盖了还是都没有生效，没有做进一步的验证。

如果是要域名分流、去广告等还是用第三方工具或者自建在 dns 那边动手吧。

当前方案已经可以满足大部分人正常使用。
