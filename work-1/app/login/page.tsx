"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, Form, Typography, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface FormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [form] = Form.useForm();

  const handleLogin = async (values: FormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        message.error("Email hoặc mật khẩu không đúng.");
      } else {
        message.error(error.message);
      }
    } else {
      message.success("Đăng nhập thành công!");
      router.refresh(); // Sẽ kích hoạt middleware và đưa về home
    }
    setLoading(false);
  };

  const handleSignUp = async (values: FormValues) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      message.error(error.message);
    } else {
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fa",
      }}
    >
      <Card
        style={{ width: 400, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={3} style={{ marginBottom: 4 }}>
            📚 Home Work
          </Title>
          <Text type="secondary">Đăng nhập để sử dụng các ứng dụng</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{ marginBottom: 12, borderRadius: 6 }}
            >
              Đăng nhập
            </Button>
            <Button
              type="default"
              size="large"
              block
              loading={loading}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    handleSignUp(values);
                  })
                  .catch(() => {
                    message.warning("Vui lòng nhập đầy đủ Email và Mật khẩu hợp lệ để đăng ký");
                  });
              }}
              style={{ borderRadius: 6 }}
            >
              Đăng ký tài khoản
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
