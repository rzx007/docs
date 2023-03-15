WebRTC音视频采集和播放示例及MediaStream媒体流解析

Lumos`

于 2022-06-28 17:36:24 发布

824
 收藏 2
分类专栏： WebRTC 文章标签： 音视频 webrtc 媒体
版权

WebRTC
专栏收录该内容
19 篇文章3 订阅
订阅专栏
WebRTC音视频采集和播放示例及MediaStream媒体流解析
目录
示例代码——同时打开摄像头和麦克风，并在页面显示画面和播放捕获的声音
API解析
mediaDevices
MediaStream媒体流
1. 示例代码——同时打开摄像头和麦克风，并在页面显示画面和播放捕获的声音
代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>WebRTC Demo</title>
</head>
<body>
<video id="local-video" autoplay playsinline></video>
<button id="showVideo">打开音视频</button>
</body>

<script>
    const constraints = {
        audio: true,
        video: {width: 640, height: 480}
    }

    // 处理打开摄像头成功
    function handleSuccess(mediaStream) {
        const video = document.querySelector("#local-video");
        video.srcObject = mediaStream;
    }

    // 异常处理
    function handleError(error) {
        console.error("getUserMedia error: " + error)
    }

    function onOpenAV(e) {
        navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
    }

    document.querySelector("#showVideo").addEventListener("click", onOpenAV)

</script>
</html>
```
效果

2. API解析
1. mediaDevices
mediaDevices 是 Navigator 只读属性，返回一个 MediaDevices 对象，该对象可提供对相机和麦克风等媒体输入设备的连接访问，也包括屏幕共享。
语法：
```js
var mediaDevices = navigator.mediaDevices;
```
1
MediaDevices 是一个单例对象，可以直接使用此对象的成员，例如通过调用navigator.mediaDevices.getUserMedia()。
2. MediaStream媒体流
navigator.mediaDevices.getUserMedia() 会提示用户给予使用媒体输入的许可，媒体输入会产生一个MediaStream（媒体流），媒体流是信息的载体，代表了一个媒体设备的内容流。
媒体流可以被采集、传输和播放，通常一个媒体流包含多个媒体轨道，如音频轨道、视频轨道。
媒体流使用MediaStream接口来管理，通常获取媒体流的方式有如下几种。
a. 从摄像头或者话筒获取流对象。
b. 从屏幕共享获取流对象。
c. 从canvas（HTMLCanvasElement）内容中获取流对象。
d. 从媒体元素（HTMLMediaElement）获取流对象。
上述方法获取的媒体流都可以通过WebRTC进行传输，并在多个对等端之间共享。
返回一个 Promise 对象，成功后会resolve回调一个 MediaStream 对象。
若用户拒绝了使用权限，或者需要的媒体源不可用，promise会reject回调一个 PermissionDeniedError 或者 NotFoundError 。
常见用法：
```js
navigator.mediaDevices.getUserMedia(constraints)
.then(function(stream) {
  /* 使用这个 stream stream */
})
.catch(function(err) {
  /* 处理 error */
});
```

MediaStream的定义
```js
interface MediaStream : EventTarget {
  constructor();
  constructor(MediaStream stream);
  constructor(sequence<MediaStreamTrack> tracks);
  readonly attribute DOMString id;
  sequence<MediaStreamTrack> getAudioTracks();
  sequence<MediaStreamTrack> getVideoTracks();
  sequence<MediaStreamTrack> getTracks();
  MediaStreamTrack? getTrackById(DOMString trackId);
  void addTrack(MediaStreamTrack track);
  void removeTrack(MediaStreamTrack track);
  MediaStream clone();
  readonly attribute boolean active;
  attribute EventHandler onaddtrack;
  attribute EventHandler onremovetrack;
};
```

1. MediaStream属性
1. active只读
返回MediaStream的状态，类型为布尔，true表示处于活跃状态，false表示处于不活跃状态。
2. id只读
返回MediaStream的UUID，类型为字符串，长度为36个字符。
2. MediaStream方法
1. addTrack()方法：向媒体流中加入新的媒体轨道。
```js
stream.addTrack(track);
参数：Track，媒体轨道，类型为MediaStreamTrack。
返回值：无。
```

2. clone()方法：返回当前媒体流的副本，副本具有不同且唯一的标识。
```js
const newstream = stream.clone();
// sameId为false
const sameId = newstream.id === stream.id? true : false
参数：无。
返回值：一个新的媒体流对象。
```
3. getAudioTracks()方法：返回媒体种类为audio的媒体轨道对象数组，数组成员类型为MediaStreamTrack。
注意，数组的顺序是不确定的，每次调用都可能不同。
```js
const mediaStreamTracks = mediaStream.getAudioTracks()
参数：无。
返回值：mediaStreamTracks，媒体轨道对象数组，如果当前媒体流没有音频轨道，则返回数组为空。
```

示例：使用getUserMedia()方法获取包含视频及音频轨道的媒体流，如果调用成功，则将媒体流附加到<video>元素，然后设置计时器，5s后调用getAudioTracks()方法获取所有音频轨道，最后停止播放第一个音频轨道。
```js
navigator.mediaDevices.getUserMedia({audio: true, video: true})
  .then(mediaStream => {
  document.querySelector('video').srcObject = mediaStream;
  // 5s后，停止播放第一个音频轨道
  setTimeout(() => {
    const tracks = mediaStream.getAudioTracks()
    tracks[0].stop()
  }, 5000)
})
```
4. getVideoTracks()方法：返回kind属性值为video的媒体轨道对象数组，媒体轨道对象类型为MediaStream Track。
注意，对象在数组中的顺序是不确定的，每次调用都可能不同。
```js
const mediaStreamTracks = mediaStream.getVideoTracks()
参数：无。
返回值：mediaStreamTracks是媒体轨道对象数组。如果当前媒体流没有视频轨道，则返回数组为空。
```

示例：getUserMedia()方法获取视频流，如果调用成功，则将媒体流附加到<video>元素，之后获取第一个视频轨道并从视频轨道截取图片。
```js
navigator.mediaDevices.getUserMedia({video: true})
  .then(mediaStream => {
  document.querySelector('video').srcObject = mediaStream;
  const track = mediaStream.getVideoTracks()[0];
  // 截取图片
  const imageCapture = new ImageCapture(track);
  return imageCapture;
})
```

5. getTrackById()方法：返回指定ID的轨道对象。
如果未提供参数，或者未匹配ID值，则返回null；如果存在多个相同ID的轨道，该方法返回匹配到的第一个轨道。
```js
const track = MediaStream.getTrackById(id);
参数：id，类型为字符串。
返回值：如果输入参数id与MediaStreamTrack.id匹配，则返回相应的MediaStream-Track对象，否则返回null。
```

示例：获取指定ID的媒体轨道并应用约束，将音量调整到0.5。
```js
stream.getTrackById("primary-audio-track").applyConstraints({ volume: 0.5 });

```
6. getTracks()方法：返回所有媒体轨道对象数组，包括所有视频及音频轨道。
数组中对象的顺序不确定，每次调用都有可能不同。
```js
const mediaStreamTracks = mediaStream.getTracks()
参数：无。
返回值：媒体轨道对象数组。
```
使用getUserMedia()方法获取包含视频轨道的流，如果调用成功，则将流附加到<video>元素，然后设置计时器，5s后获取所有媒体轨道，并停止播放第一个媒体轨道（即视频轨道）。
navigator.mediaDevices.getUserMedia({audio: false, video: true})
.then(mediaStream => {
  document.querySelector('video').srcObject = mediaStream;
  // 5s后，停止播放第一个媒体轨道
  setTimeout(() => {
    const tracks = mediaStream.getTracks()
    tracks[0].stop()
  }, 5000)
})
1
2
3
4
5
6
7
8
9
3. MediaStream事件
1. addtrack事件：当有新的媒体轨道（MediaStreamTrack）加入时触发该事件，对应事件句柄onaddtrack
注意，只有在如下情况下，才会触发该事件，主动调用MediaStream.addTrack()方法则不会触发。
RTCPeerConnection重新协商。
HTMLMediaElement.captureStream() 返回新的媒体轨道。
示例：当有新的媒体轨道添加到媒体流时，显示新增媒体轨道的种类和标签。
// event类型为MediaStreamTrackEvent
// event.track类型为MediaStreamTrack
stream.onaddtrack = (event) => {
  let trackList = document.getElementById("tracks");
  let label = document.createElement("li");

  label.innerHTML = event.track.kind + ": " + event.track.label;
  trackList.appendChild(label);
};
1
2
3
4
5
6
7
8
9
此外，也可以使用addEventListener()方法监听事件addtrack。
2. removetrack事件：当有媒体轨道被移除时触发该事件，对应事件句柄onremovetrack
注意，只有在如下情况下才会触发该事件，主动调用MediaStream.removeTrack()方法则不会触发。
RTCPeerConnection重新协商。
HTMLMediaElement.captureStream()返回新的媒体轨道。
示例：当从媒体流中删除媒体轨道时，记录该媒体轨道信息。
// event类型为MediaStreamTrackEvent
// event.track类型为MediaStreamTrack
stream.onremovetrack = (event) => {
  let trackList = document.getElementById("tracks");
  let label = document.createElement("li");

  label.innerHTML = "Removed: " + event.track.kind + ": " + event.track.label;
  trackList.appendChild(label);
};
1
2
3
4
5
6
7
8
9
此外，也可以使用addEventListener()方法监听事件removetrack。
4. 参数constraints
constraints作为一个MediaStreamConstraints对象，指定了请求的媒体类型和相对应的参数。

constraints 参数是一个包含了video 和 audio两个成员的MediaStreamConstraints 对象，用于说明请求的媒体类型。

必须至少一个类型或者两个同时可以被指定。
如果浏览器无法找到指定的媒体类型或者无法满足相对应的参数要求，那么返回的 Promise 对象就会处于 rejected［失败］状态，NotFoundError作为 rejected［失败］回调的参数。
以下同时请求不带任何参数的音频和视频：

{ audio: true, video: true }
1
如果为某种媒体类型设置了 true ，得到的结果的流中就需要有此种类型的轨道。如果其中一个由于某种原因无法获得，getUserMedia() 将会产生一个错误。

当由于隐私保护的原因，无法访问用户的摄像头和麦克风信息时，应用可以使用额外的 constraints 参数请求它所需要或者想要的摄像头和麦克风能力。

下面演示了应用想要使用 1280x720 的摄像头分辨率：

{
  audio: true,
  video: { width: 1280, height: 720 }
}
1
2
3
4
浏览器会试着满足这个请求参数，但是如果无法准确满足此请求中参数要求或者用户选择覆盖了请求中的参数时，有可能返回其它的分辨率。
强制要求获取特定的尺寸时，可以使用关键字min、max 或者 exact（就是 min == max）。
以下参数表示要求获取最低为 1280x720 的分辨率。
{
  audio: true,
  video: {
    width: { min: 1280 },
    height: { min: 720 }
  }
}
1
2
3
4
5
6
7
如果摄像头不支持请求的或者更高的分辨率，返回的 Promise 会处于 rejected 状态，NotFoundError 作为rejected 回调的参数，而且用户将不会得到要求授权的提示。
造成不同表现的原因是，相对于简单的请求值和ideal关键字而言，关键字min, max, 和 exact有着内在关联的强制性，比如：
{
  audio: true,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 776, ideal: 720, max: 1080 }
  }
}
1
2
3
4
5
6
7
当请求包含一个 ideal（应用最理想的）值时，这个值有着更高的权重，意味着浏览器会先尝试找到最接近指定的理想值的设定或者摄像头（如果设备拥有不止一个摄像头）。
简单的请求值也可以理解为是应用理想的值，因此我们的第一个指定分辨率的请求也可以写成如下：
{
  audio: true,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
}
1
2
3
4
5
6
7
并不是所有的 constraints 都是数字。例如，在移动设备上面，如下的例子表示优先使用前置摄像头（如果有的话）：
{ audio: true, video: { facingMode: "user" } }
1
强制使用后置摄像头，请用：
{ audio: true, video: { facingMode: { exact: "environment" } } }
1
在某些情况下，比如WebRTC上使用受限带宽传输时，低帧率可能更适宜。
{ video: { frameRate: { ideal: 10, max: 15 } } };
1
5. 返回值
var promise = navigator.mediaDevices.getUserMedia(constraints);
1
返回一个 Promise，这个 Promise 成功后的回调函数带一个 MediaStream 对象作为其参数。
6. 异常值
返回一个失败状态的 Promise，这个 Promise 失败后的回调函数带一个DOMException对象作为其参数。 可能的异常有：
AbortError［中止错误］
尽管用户和操作系统都授予了访问设备硬件的权利，而且未出现可能抛出NotReadableError异常的硬件问题，但仍然有一些问题的出现导致了设备无法被使用。
NotAllowedError［拒绝错误］
用户拒绝了当前的浏览器实例的访问请求；或者用户拒绝了当前会话的访问；或者用户在全局范围内拒绝了所有媒体访问请求。
较旧版本的规范使用了SecurityError，但在新版本当中SecurityError被赋予了新的意义。
NotFoundError［找不到错误］
找不到满足请求参数的媒体类型。
NotReadableError［无法读取错误］
尽管用户已经授权使用相应的设备，操作系统上某个硬件、浏览器或者网页层面发生的错误导致设备无法被访问。
OverconstrainedError［无法满足要求错误］
指定的要求无法被设备满足，此异常是一个类型为OverconstrainedError的对象，拥有一个constraint属性，这个属性包含了当前无法被满足的constraint对象，还拥有一个message属性，包含了阅读友好的字符串用来说明情况。
NotFoundError［找不到错误］
找不到满足请求参数的媒体类型。
NotReadableError［无法读取错误］
尽管用户已经授权使用相应的设备，操作系统上某个硬件、浏览器或者网页层面发生的错误导致设备无法被访问。
OverconstrainedError［无法满足要求错误］
指定的要求无法被设备满足，此异常是一个类型为OverconstrainedError的对象，拥有一个constraint属性，这个属性包含了当前无法被满足的constraint对象，还拥有一个message属性，包含了阅读友好的字符串用来说明情况。
SecurityError［安全错误］
在getUserMedia() 被调用的 Document 上面，使用设备媒体被禁止。这个机制是否开启或者关闭取决于单个用户的偏好设置。
TypeError［类型错误］
constraints 对象未设置［空］，或者都被设置为false。