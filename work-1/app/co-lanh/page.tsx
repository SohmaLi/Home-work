"use client";

import React, { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Card,
  Tag,
  Descriptions,
  Skeleton,
  message,
  Alert,
  Typography,
  Divider,
  List,
} from "antd";
import { SearchOutlined, BookOutlined } from "@ant-design/icons";
import Sidebar from "@/components/Sidebar";

const { Content } = Layout;
const { Title, Text } = Typography;

const SIDEBAR_WIDTH = 250;

interface WordResult {
  word: string;
  corrected_word?: string;
  phonetic: string;
  meaning: string;
  example: string;
  example_translation: string;
  grammar_notes: {
    topic: string;
    description: string;
  }[];
  level: "Dễ" | "Trung bình" | "Khó";
}

const LEVEL_COLOR: Record<WordResult["level"], string> = {
  Dễ: "success",
  "Trung bình": "warning",
  Khó: "error",
};

function highlightWord(sentence: string, word: string): React.ReactNode {
  if (!word) return sentence;
  const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = sentence.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        style={{
          backgroundColor: "#fff566",
          borderRadius: 3,
          padding: "0 2px",
          fontStyle: "inherit",
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function CoLanhPage() {
  const [wordInput, setWordInput] = useState("");
  const [result, setResult] = useState<WordResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handleSearch = async () => {
    const word = wordInput.trim();
    if (!word) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        messageApi.error(data.error || "Không thể tra cứu từ này. Vui lòng thử lại.");
        return;
      }

      setResult(data as WordResult);
    } catch {
      messageApi.error("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Sidebar activeKey="2" />

      <Layout style={{ marginLeft: SIDEBAR_WIDTH }}>
        <Content
          style={{
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#f5f7fa",
            padding: "40px 10%",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Title level={2} style={{ marginBottom: 4, color: "#141414" }}>
              📖 Từ Điển Học Thuật
            </Title>
            <Text type="secondary" style={{ fontSize: 15 }}>
              Nhập từ tiếng Anh để xem nghĩa, phiên âm và ghi chú ngữ pháp
            </Text>
          </div>

          {/* Search Box */}
          <div
            style={{
              display: "flex",
              gap: 12,
              maxWidth: 600,
              margin: "0 auto 40px",
            }}
          >
            <Input
              size="large"
              placeholder="Nhập từ vựng (VD: serendipity)"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={onEnter}
              prefix={<BookOutlined style={{ color: "#bfbfbf" }} />}
              style={{ borderRadius: 8 }}
              disabled={loading}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
              disabled={!wordInput.trim()}
              style={{ borderRadius: 8, paddingInline: 24 }}
            >
              Tra cứu
            </Button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <Card
              style={{ maxWidth: 720, margin: "0 auto", borderRadius: 12 }}
              bordered={false}
              styles={{ body: { padding: 32 } }}
            >
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          )}

          {/* Spell correction banner */}
          {!loading && result?.corrected_word && (
            <Alert
              type="warning"
              showIcon
              style={{ maxWidth: 720, margin: "0 auto 16px", borderRadius: 8 }}
              message={
                <span>
                  Không tìm thấy từ <strong>&ldquo;{wordInput}&rdquo;</strong>. Đang hiển thị kết quả cho từ{" "}
                  <strong>&ldquo;{result.corrected_word}&rdquo;</strong>.
                </span>
              }
            />
          )}

          {/* Result Card */}
          {!loading && result && (
            <Card
              style={{
                maxWidth: 720,
                margin: "0 auto",
                borderRadius: 12,
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
              }}
              bordered={false}
              styles={{ body: { padding: 32 } }}
            >
              {/* Word header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    {result.word}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    {result.phonetic}
                  </Text>
                </div>
                <Tag
                  color={LEVEL_COLOR[result.level]}
                  style={{ fontSize: 13, padding: "4px 12px", borderRadius: 20 }}
                >
                  {result.level}
                </Tag>
              </div>

              <Divider style={{ margin: "16px 0" }} />

              {/* Descriptions */}
              <Descriptions
                column={1}
                bordered
                size="middle"
                styles={{ label: { fontWeight: 600, width: 160, backgroundColor: "#fafafa" } }}
              >
                <Descriptions.Item label="📌 Nghĩa tiếng Việt">
                  <Text>{result.meaning}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="💬 Ví dụ">
                  <div>
                    <Text italic style={{ color: "#595959", display: "block", marginBottom: 4 }}>
                      {highlightWord(result.example, result.word)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {result.example_translation}
                    </Text>
                  </div>
                </Descriptions.Item>
              </Descriptions>

              {/* Grammar Notes */}
              {result.grammar_notes.length > 0 && (
                <>
                  <Divider style={{ marginTop: 24, fontSize: 14 }}>
                    📝 Ghi chú ngữ pháp
                  </Divider>
                  <List
                    dataSource={result.grammar_notes}
                    renderItem={(note, index) => (
                      <List.Item
                        key={index}
                        style={{
                          padding: "8px 12px",
                          background: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                          borderRadius: 6,
                          border: "none",
                          marginBottom: 4,
                        }}
                      >
                        <div>
                          <Text strong style={{ color: "#1677ff", marginRight: 8 }}>
                            {index + 1}. {note.topic}:
                          </Text>
                          <Text>{note.description}</Text>
                        </div>
                      </List.Item>
                    )}
                    bordered={false}
                    style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  />
                </>
              )}
            </Card>
          )}

          {/* Empty state */}
          {!loading && !result && (
            <div style={{ textAlign: "center", color: "#8c8c8c", marginTop: 40 }}>
              <BookOutlined style={{ fontSize: 48, marginBottom: 16, color: "#d9d9d9" }} />
              <br />
              <Text type="secondary">Nhập một từ tiếng Anh để bắt đầu tra cứu</Text>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
