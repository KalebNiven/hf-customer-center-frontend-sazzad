import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  @font-face {
    font-family:"museo-sans";
    src:url("https://use.typekit.net/af/620bf8/00000000000000000000e7fe/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("woff2"),url("https://use.typekit.net/af/620bf8/00000000000000000000e7fe/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("woff"),url("https://use.typekit.net/af/620bf8/00000000000000000000e7fe/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n3&v=3") format("opentype");
    font-display:swap;font-style:normal;font-weight:300;
  }
  @font-face {
    font-family:"museo-sans";
    src:url("https://use.typekit.net/af/5cca6d/00000000000000000000e802/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i3&v=3") format("woff2"),url("https://use.typekit.net/af/5cca6d/00000000000000000000e802/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i3&v=3") format("woff"),url("https://use.typekit.net/af/5cca6d/00000000000000000000e802/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i3&v=3") format("opentype");
    font-display:swap;font-style:italic;font-weight:300;
  }
  @font-face {
    font-family:"museo-sans";
    src:url("https://use.typekit.net/af/a28b50/00000000000000000000e803/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("woff2"),url("https://use.typekit.net/af/a28b50/00000000000000000000e803/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("woff"),url("https://use.typekit.net/af/a28b50/00000000000000000000e803/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3") format("opentype");
    font-display:swap;font-style:normal;font-weight:500;
  }
  @font-face {
    font-family:"museo-sans";
    src:url("https://use.typekit.net/af/c2d3de/00000000000000000000e804/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i5&v=3") format("woff2"),url("https://use.typekit.net/af/c2d3de/00000000000000000000e804/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i5&v=3") format("woff"),url("https://use.typekit.net/af/c2d3de/00000000000000000000e804/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i5&v=3") format("opentype");
    font-display:swap;font-style:italic;font-weight:500;
  }

  .tk-museo-sans { font-family: "museo-sans", sans-serif; }
 
  .museo { font-family: "museo-sans", sans-serif; }

  *:focus {
    outline: auto 0 -webkit-focus-ring-color; /* Webkit, Safari */
  }

  html, body {
    padding: 0;
    margin: 0;
    font-family: "museo-sans", sans-serif;

    /* height: 100vh;
    overflow: hidden;

    @media screen and (max-width: 600px) {
      overflow-y: auto;
      height: auto;
    } */
  
    &::-webkit-scrollbar {
      width: 8px; /* width of the entire scrollbar */
    }
    &::-webkit-scrollbar-track {
      background: #f8f8f8; /* color of the tracking area */
    }
    &::-webkit-scrollbar-thumb {
      background-color: #e3e3e3; /* color of the scroll thumb */
      border-radius: 0px; /* roundness of the scroll thumb */
      border: 1px solid #e0e0e0; /* creates padding around scroll thumb */
    } 

    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #000000;
      color: white;
      padding: 8px;
      z-index: 100;
      display: none;
    }
    
    .skip-link:focus {
      top: 0;
    }

  }

  input[type="radio"] + li {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    padding: 0px;
    background-clip: content-box;
    border: 1px solid #bbbbbb;
    background-color: #fff;
    border-radius: 50%;
  }

  input[type="radio"]:checked + li {
    width: 24px;
    height: 24px;
    border: 6px solid #003863;
    padding: 0px;
    background-color: #fff;
  }

  input[type="radio"] + li {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    padding: 0px;
    background-clip: content-box;
    border: 1px solid #bbbbbb;
    background-color: #fff;
    border-radius: 50%;

    &.status {
      width: 18px;
      height: 18px;
      border: 2px solid #008bbf;
    }
  }

  input[type="radio"]:checked + li {
    border: 6px solid #003863;
    padding: 0px;
    background-color: #fff;

    &.status {
      width: 18px;
      height: 18px;
      padding: 2px;
      background-color: #008bbf;
      border: 2px solid #008bbf;
    }
  }
`;
