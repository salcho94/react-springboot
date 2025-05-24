import { useState, useCallback, useMemo, useRef } from "react";
import { Copy } from "lucide-react"; // 아이콘 라이브러리 사용
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const copyTimeoutRef = useRef(null);

    // ✅ 클립보드 복사 함수 (HTTP 환경 대응)
    const handleCopy = useCallback(async () => {
        let copyText = text;

        if (typeof text !== "string") {
            try {
                copyText = JSON.stringify(text, getCircularReplacer(), 2);
            } catch (error) {
                console.error("JSON 변환 오류:", error);
                alert("복사할 수 없는 데이터입니다.");
                return;
            }
        }

        try {
            await navigator.clipboard.writeText(copyText);
        } catch (error) {
            console.warn("navigator.clipboard 실패, fallback 방식 사용");
            fallbackCopyText(copyText);
        }

        setCopied(true);
        if (copyTimeoutRef.current) {
            clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
    }, [text]);

    // ✅ 순환 참조 제거 함수
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return "[Circular]";
                }
                seen.add(value);
            }
            return value;
        };
    };

    // ✅ HTTP 환경에서도 복사 가능하게 하는 fallback 함수
    const fallbackCopyText = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
        } catch (error) {
            console.error("fallback 복사 실패:", error);
        }
        document.body.removeChild(textArea);
    };

    // ✅ `useMemo` 사용하여 불필요한 렌더링 방지
    const MemoizedSyntaxHighlighter = useMemo(() => (
        <SyntaxHighlighter
            language="javascript"
            style={oneDark}
            wrapLongLines={true}
            customStyle={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "0.9rem",
            }}
        >
            {text}
        </SyntaxHighlighter>
    ), [text]);

    return (
        <div className="relative border rounded-lg overflow-hidden bg-gray-900 p-3">
            {MemoizedSyntaxHighlighter}
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded hover:bg-gray-600 transition"
            >
                {copied ? "✔" : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );
};

export default CodeBlock;
