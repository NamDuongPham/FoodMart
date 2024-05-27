import styled from "styled-components";

function Loading() {
  return (
    <DivCustom className="ttloader bg-[#fff1d8] w-[100%] h-[100vh]">
      <span className="rotating load-open w-[100%] h-[100%] flex justify-center items-center">
        <img src="../images/spin.png" alt="spin load"/>
      </span>
    </DivCustom>
  );
}

export default Loading;
export const DivCustom = styled.div`
  .ttloader {
    background-color: #fff1d8;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999999;
    .rotating {
      background-position: center center;
      background-repeat: no-repeat;
      bottom: 0;
      height: auto;
      left: 0;
      margin: auto;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
    }

    .rotating {
      background-image: url(/images/spin.png);
    }
  }
`;
