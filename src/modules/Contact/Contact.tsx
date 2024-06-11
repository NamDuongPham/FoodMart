import { db } from "@/firebase";
import { Button, Form, Input, notification } from "antd";
import { push, ref, set } from "firebase/database";
import { useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SITE_MAP } from "../../constants/site-map";

function Contact() {
  const navigate = useNavigate();
  const handleClickToHome = () => {
    navigate(SITE_MAP.HOME.url);
  };
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  // const [approve, setApprove] = useState(false);
  const handleAddContact = async () => {
    try {
      const newDocRef = push(ref(db, "contacts"));
      await set(newDocRef, {
        fullName: name,
        phoneNumber: phone,
        email: email,
        description: description,
      });
      notification.success({
        message: "add form success!",
      });
    } catch (error) {
      console.error("Error adding contact: ", error);
      notification.error({
        message: "add form fail!",
      });
    }
  };

  return (
    <>
      <div className="text-[#123829]  ">
        <div className="bg-[#fff1d8] mt-10 py-[70px] text-[#123829]">
          <div className="container mx-auto ">
            <div>
              <div>
                <a
                  className="flex gap-2 text-[22px] cursor-pointer mb-10 text-[#e85353]"
                  onClick={handleClickToHome}
                >
                  <span className="svg-ic">
                    <BsArrowLeftCircle />
                  </span>
                  Back to Home
                </a>
                <div className="text-[40px] font-bold mb-[12px]">
                  <h2>Contact with us</h2>
                </div>
                <p>
                  Welcome to our "Contact Us" page, your gateway to reaching out
                  and connecting with us.
                  <br /> We value your feedback, inquiries, and suggestions, and
                  we are here to assist you in any way we can.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Form */}
      <div className="container mx-auto flex justify-between mt-20 h-[500px]">
        <div className="flex gap-16">
          <div className="text-[20px] text-[#123829]">
            <h4 className="font-bold">CALL US</h4>
            <p className=" font-light mt-2">+84 707766109</p>
          </div>
          <div className="text-[20px] text-[#123829]">
            <h4 className="font-bold">ADDRESS</h4>
            <p className="font-light mt-2">
              237 Phạm Văn Chiêu P.14 Quận Gò Vấp Tp Hồ Chí Minh
            </p>
          </div>
        </div>
        {/*  */}
        <div className="relative bottom-[250px] ">
          <h1>Contact form</h1>
          <div className="border-solid border-[1px] border-black bg-white ">
            <div className="p-4 ">
              <FormCustom
                variant="filled"
                style={{ maxWidth: 800, fontSize: 30 }}
              >
                <Form.Item
                  label="Full name"
                  name="fullName"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                  ]}
                >
                  <Input
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input your number phone!",
                      pattern: /^[0-9]+$/,
                    },
                  ]}
                >
                  <Input
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                      type: "email",
                    },
                  ]}
                >
                  <Input
                    placeholder="Phone Number"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: "Please input Description!" },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Description"
                    className="h-[150px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    className="bg-[#e85353] relative top-[170px] rounded-[30px] w-36 h-12 text-center text-white font-semibold"
                    type="primary"
                    htmlType="submit"
                    disabled={!phone.trim() && !name.trim()}
                    onClick={() => {
                      handleAddContact();
                    }}
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </FormCustom>
            </div>
          </div>
        </div>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.479437901294!2d106.65284937583895!3d10.85109235781041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529609110c5a3%3A0x843133b436fa2e0d!2zMjM3IFBo4bqhbSBWxINuIENoacOqdSwgUGjGsOG7nW5nIDE2LCBHw7IgVuG6pXAsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1711809774045!5m2!1sen!2s"
        width="100%"
        height={450}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </>
  );
}

export default Contact;
const FormCustom = styled(Form)`
  width: 500px;
  height: 600px;

  :where(.css-dev-only-do-not-override-1ae8k9u).ant-form-item
    .ant-form-item-label
    > label {
    font-size: 22px;
    color: #123829;
    font-weight: 600;
    margin-top: 20px;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-input {
    background-color: white;
    border: 1px solid #cfcfcf;
    width: 500px;
  }
  :where(
      .css-dev-only-do-not-override-1ae8k9u
    ).ant-input-filled.ant-input-status-error:not(.ant-input-disabled) {
    background: #fff2f0;
    border-width: 1px;
    border-style: solid;
    border-color: transparent;

    top: -20px;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-form-item-with-help
    .ant-form-item-explain {
    height: auto;
    opacity: 1;
    position: relative;
    bottom: 20px;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-input-number
    .ant-input-number-input {
    box-sizing: border-box;
    margin: 0;
    padding: 4px 11px;
    color: rgba(0, 0, 0, 0.88);
    line-height: 1.5714285714285714;
    list-style: none;
    width: 100%;
    text-align: start;
    background-color: white;
    border-radius: 6px;
    outline: 0;
    transition: all 0.2s linear;
    appearance: textfield;
    border: 1px solid #cfcfcf;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-row {
    display: flex;
    flex-flow: column;
    min-width: 0;
    justify-content: flex-start;
    align-items: start;
    gap: 20px;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-form-horizontal
    .ant-form-item-control {
    margin-top: 20px;
    display: flex;
    flex: none;
  }
`;
