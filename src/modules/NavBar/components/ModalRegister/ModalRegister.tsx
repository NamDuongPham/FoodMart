import ModalCustom from "../../../../components/ModalCustom/ModalCustom";
import Register from "../../../Register/Register";

interface IProps {
    isOpenRegister: boolean;
    setIsOpenRegister: (_is: boolean) => void;
  }
function ModalRegister({ isOpenRegister, setIsOpenRegister }: IProps) {
    return (
        <ModalCustom
        title="REGISTER"
        isOpen={isOpenRegister}
        setIsOpen={setIsOpenRegister}
        footer={<></>}
      >
        <>
          <Register setIsOpen={setIsOpenRegister} />
          
        </>
      </ModalCustom>
    );
}

export default ModalRegister;