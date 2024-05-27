import { Button, Checkbox, Form, Input, notification } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styled } from "styled-components";
import { auth } from "../../firebase";
import ModalRegister from "../NavBar/components/ModalRegister/ModalRegister";
import { useDispatch } from "react-redux";
import { updateUser } from "@/stores/slices/UserSlice";

interface IProps {
  setIsOpen?: (open: boolean) => void;
}
function Login(props: IProps) {
  const dispatch = useDispatch();
  const [isOpenModalRegister, setIsOpenModalRegister] = useState(false);
  const openModalRegister = () => {
    setIsOpenModalRegister(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;

      props.setIsOpen && props.setIsOpen(false);
      notification.success({
        message: "login success!",
      });
      dispatch(
        updateUser({
          uid:user.uid!,
          email: user.email!,
          name: user.displayName!,
          phone: user.phoneNumber!,
          token: user.refreshToken,
          address: "",
        })
      );
    });
  };

  return (
    <>
      <div>
        <FormContainer
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={() => {}}
          onFinishFailed={() => {}}
          autoComplete="off"
        >
          <Form.Item
            // label='Email'
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="Email"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </Form.Item>

          <Form.Item
            // label='Password'
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={handleLogin}>
              Submit
            </Button>
          </Form.Item>
          <div className="flex  items-center max-w-full w-ful footer-login">
            or
          </div>
          <div className="flex flex-col gap-4 mt-3">
            <Button icon={<FcGoogle />}>Login with Google</Button>
            <Button icon={<AiFillGithub />}>Login with Github</Button>
            <div
              className="
      text-neutral-500 text-center mt-4 font-light"
            >
              <p>
                First time using Foodmart?
                <span
                  className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
                  onClick={openModalRegister}
                >
                  Create an account
                </span>
              </p>
            </div>
            <ModalRegister
              isOpenRegister={isOpenModalRegister} // Step 4
              setIsOpenRegister={setIsOpenModalRegister} // Step 4
            />
          </div>
        </FormContainer>
      </div>
    </>
  );
}

export default Login;

const FormContainer = styled(Form)`
  padding: 10px 20px;
  .ant-row {
    max-width: 100%;
    display: block;
    .ant-col {
      max-width: 100%;
      position: relative;
      display: block;
      margin: 0;
      .ant-form-item-control-input {
        position: relative;
        display: block;
        .ant-btn {
          position: absolute;
          left: 0px;
          width: 100%;
          color: white;
          background-color: #de3151;
        }
        .ant-btn:hover {
          color: black;
          background-color: white;
          border: 1px solid #de3151;
        }
      }
    }
  }
  .footer-login::before {
    content: "";
    width: 100%;
    height: 1px;
    background-color: #ddd;
  }
  .footer-login::after {
    content: "";
    width: 100%;
    height: 1px;
    background-color: #ddd;
  }
`;
