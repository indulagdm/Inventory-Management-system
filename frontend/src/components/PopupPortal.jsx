import React from "react";
import ReactDOM from "react-dom";

const PopupPortal = ({ children, onClose }) => {
  const [externalWindow, setExternalWindow] = React.useState(null);
  const container = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    const win = window.open("", "", "width=400,height=300");
    setExternalWindow(win);
    win.document.body.appendChild(container.current);
    win.addEventListener("beforeunload", onClose);

    return () => {
      win.close();
    };
  }, [onClose]);

  if (!externalWindow) return null;
  return ReactDOM.createPortal(children, container.current);
};

export default PopupPortal;
