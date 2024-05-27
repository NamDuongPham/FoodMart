
import ModalCustom from '../../../../components/ModalCustom/ModalCustom';
import Login from '../../../Login/Login';
interface IProps {
  isOpen: boolean;
  setIsOpen: (_is: boolean) => void;
}
function ModalLogin({ isOpen, setIsOpen }: IProps) {
  return (
    <ModalCustom title='LOG IN' isOpen={isOpen} setIsOpen={setIsOpen} footer={<></>}>
      <>
        <Login setIsOpen={setIsOpen} />
        <div style={{ height: 50 }}></div>
      </>
    </ModalCustom>
  );
}

export default ModalLogin;
