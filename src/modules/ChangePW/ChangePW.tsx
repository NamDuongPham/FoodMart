import { Button, Form, Input } from "antd";

function ChangePW() {
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  return (
    <div>
      <Form>
        <Form.Item
          name="password"
          label="Old Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password className="w-[400px] relative left-6" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password className="w-[400px] relative left-12" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password className="w-[400px]" />
        </Form.Item>

        <div className="flex gap-5">
          <Button className="bg-red-500" type="primary" htmlType="submit">
            Save
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ChangePW;
