import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import "./App.css";

let content =
  "不为人知的是，李铁标志性的“吹刘海”动作竟然是在28年前就已经形成。李铁从小性格叛逆，一直想留长发，但是因为在少年队时教练管的太严，不允许队员们头发的刘海长度超过眼睛，李铁被迫只能留着平头。后来李铁跟随健力宝队去巴西训练，教练终于对球员的发型没有太严格的要求，李铁也得以放飞自我，留了一头中分长发，刘海几乎盖住了眼睛。当时的李铁仅有16岁，随着健力宝队在巴西踢球。李铁曾透露当时因为穷，当地理发比较贵，他就留了稍长的头发，刘海挡眼睛了，就会下意识的吹一下，就这样养成了习惯。1993年，引起全国瞩目的健力宝足球队横空出世，张效瑞、商毅、李金羽、郝伟、张永海。。。一个个日后闪耀中国足坛的名字不一而足，李铁也入选了第一批22人最终名单，他留下了一张青涩的照片，那时的他就留着如今这般茂密的刘海。结束===".repeat(
    1000
  );

export default function App() {
  const [fontArr, setFontArr] = useState([]);
  const [firstText, setFirstText] = useState("");
  const [hideFirst, setHideFirst] = useState(false);
  const [textHeight, calTextHeight] = useState(0);
  const [pageDataArr, setPageDataArr] = useState([]);
  const dom = useRef(null);

  useEffect(() => {
    getFirstText();
  }, []);

  useEffect(() => {
    // console.log("触发了", firstText);
    if (firstText.length > 0 && dom.current) {
      let currentTextHeight = dom.current.offsetHeight;
      let windowHeight = document.body.clientHeight;
      calTextHeight(windowHeight / currentTextHeight);
      setHideFirst(true);
      console.log(windowHeight / currentTextHeight, currentTextHeight);
    }
  }, [firstText]);

  useLayoutEffect(() => {
    if (textHeight) {
      console.log("能放多少行", textHeight);
      calTextNumber();
    }
  }, [textHeight]);

  const getFirstText = () => {
    const windowWidth = document.body.offsetWidth;
    const fontStyle = "normal 16px Arial";
    const len = charCountFitInWith(windowWidth, content, fontStyle);
    const first = content.slice(0, len);
    setFirstText(first);
  };

  const charCountFitInWith = (containerWidth, char, font) => {
    const canvasEle = document.createElement("canvas");
    const context = canvasEle.getContext("2d");
    context.font = font;

    let num = 1;
    while (num < char.length) {
      const { width } = context.measureText(char.slice(0, num));
      // 标点符号算的不是特别准
      if (width >= containerWidth) return num - 3;
      num++;
    }
    return num;
  };

  const calTextNumber = () => {
    const windowWidth = document.body.offsetWidth;
    const fontStyle = "normal 16px Arial";
    let calLen = 0;
    let calFontArr = [];
    while (content.length !== 0 && calFontArr.length < textHeight) {
      const len = charCountFitInWith(
        windowWidth,
        content.slice(calLen),
        fontStyle
      );
      console.log(calLen, len);
      calFontArr.push(content.slice(calLen, len + calLen));
      if (calLen === 0) {
        setFirstText(content.slice(0, len));
      }
      calLen = len + calLen;
    }
    setFontArr(calFontArr);
    // 处理剩下的数据
    requestIdleCallback(calLimitPage);
    // calNoLimitPage();
  };

  const calLimitPage = (deadline) => {
    console.log(pageDataArr, fontArr, "first");
    const windowWidth = document.body.offsetWidth;
    const fontStyle = "normal 16px Arial";
    const calAllPage = pageDataArr;
    let calFontArr =
      pageDataArr.length > 0 &&
      content.length > 0 &&
      pageDataArr[pageDataArr.length - 1].length < textHeight
        ? pageDataArr.pop()
        : [];
    console.log(calFontArr, "cal");
    while (content.length !== 0 && deadline.timeRemaining() > 0) {
      const len = charCountFitInWith(windowWidth, content, fontStyle);
      if (calFontArr.length < textHeight) {
        calFontArr.push(content.slice(0, len));
        content = content.slice(len);
      } else {
        calAllPage.push(calFontArr);
        calFontArr = [];
      }
    }
    console.log(calAllPage, "页面已经分好");
    if (calFontArr.length !== 0) {
      calAllPage.push(calFontArr);
      setPageDataArr(calAllPage);
    }
    if (content.length > 0) {
      requestIdleCallback(calLimitPage);
    }
  };

  // 无时间分片的
  const calNoLimitPage = () => {
    console.log(pageDataArr, fontArr, "first");
    const windowWidth = document.body.offsetWidth;
    const fontStyle = "normal 16px Arial";
    const calAllPage = pageDataArr;
    let calFontArr =
      pageDataArr.length > 0 &&
      pageDataArr[pageDataArr.length - 1].length < textHeight
        ? pageDataArr[pageDataArr.length - 1]
        : [];
    // console.log(content);
    while (content.length !== 0) {
      const len = charCountFitInWith(windowWidth, content, fontStyle);
      if (calFontArr.length < textHeight) {
        calFontArr.push(content.slice(0, len));
        content = content.slice(len);
      } else {
        calAllPage.push(calFontArr);
        calFontArr = [];
      }
    }
    console.log(calAllPage, "页面已经分好");
    if (calFontArr.length !== 0) {
      calAllPage.push(calFontArr);
    }
    setPageDataArr(calAllPage);
  };

  return (
    <div className="content">
      {!hideFirst && <p ref={dom}>{firstText}</p>}
      {fontArr.map((item, i) => (
        <p key={item + i} className="fontSize">
          {item}
        </p>
      ))}
    </div>
  );
}
