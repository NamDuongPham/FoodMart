import { Button, Checkbox, Form, Input, notification } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { ChangeEvent, useState } from "react";
import { styled } from "styled-components";
import { auth, db } from "../../firebase";

interface IProps {
  setIsOpen?: (open: boolean) => void;
}
// interface Customer {
//   nameCustomer: string;
//   addressCustomer: string;
//   emailCustomer: string;
//   passwordCustomer: string;
//   phoneNumberCustomer: string;
// }
function Register(props: IProps) {
  //const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    props.setIsOpen && props.setIsOpen(false);
    console.log(user);
    //dispatch(setUser(user));
    try {
      const newDocRef = (ref(db, `customer/${user.uid}`));
      await set(newDocRef, {
        nameCustomer: "",
        addressCustomer: "",
        emailCustomer: email,
        passwordCustomer: password,
        phoneNumberCustomer: "",
      });
      notification.success({
        message: "register success!",
      });
    } catch (error) {
      console.error("Error adding customer: ", error);
      notification.error({
        message: "register fail!",
      });
    }
  };

  return (
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
          <Button type="primary" htmlType="submit" onClick={handleRegister}>
            REGISTER
          </Button>
        </Form.Item>
      </FormContainer>
    </div>
  );
}

export default Register;
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
