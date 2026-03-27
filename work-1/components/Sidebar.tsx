"use client";

import React, { useState } from "react";
import { Layout, Menu, Button, message } from "antd";
import { MessageOutlined, BookOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const { Sider } = Layout;

interface SidebarProps {
  activeKey?: string;
}

const MENU_ROUTES: Record<string, string> = {
  "1": "/co-minh",
  "2": "/co-lanh",
};

export default function Sidebar({ activeKey }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [loadingOut, setLoadingOut] = useState(false);

  // Tự detect activeKey từ pathname nếu không truyền vào
  const selectedKey =
    activeKey ??
    (pathname.startsWith("/co-lanh") ? "2" : "1");

  const handleMenuClick = ({ key }: { key: string }) => {
    const route = MENU_ROUTES[key];
    if (route) router.push(route);
  };

  const handleLogout = async () => {
    setLoadingOut(true);
    const { error } = await supabase.auth.signOut();
    setLoadingOut(false);
    
    if (error) {
      message.error("Lỗi đăng xuất: " + error.message);
    } else {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <Sider
      width={250}
      theme="light"
      style={{
        borderRight: "1px solid #f0f0f0",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontWeight: "bold",
          fontSize: 17,
          borderBottom: "1px solid #f0f0f0",
          color: "#1677ff",
          flexShrink: 0,
        }}
      >
        📚 Home Work
      </div>

      {/* Navigation */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
        items={[
          {
            key: "1",
            icon: <MessageOutlined />,
            label: "Cô Minh English",
          },
          {
            key: "2",
            icon: <BookOutlined />,
            label: "Từ Điển Cô Lành",
          },
        ]}
      />

      {/* Logout Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          borderTop: "1px solid #f0f0f0",
          backgroundColor: "#fff",
        }}
      >
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          block
          loading={loadingOut}
          onClick={handleLogout}
          style={{ textAlign: "left", paddingLeft: 12 }}
        >
          Đăng xuất
        </Button>
      </div>
    </Sider>
  );
}
