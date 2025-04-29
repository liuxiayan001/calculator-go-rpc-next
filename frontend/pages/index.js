import React, {useState} from 'react';
import {createClient} from '@connectrpc/connect';
import {createConnectTransport} from '@connectrpc/connect-web';
import {CalculatorService} from '@/proto/calculator_connect';
import {CalculateRequest} from '@/proto/calculator_pb';

const transport = createConnectTransport({
    baseUrl: 'http://localhost:8080',
    useBinaryFormat: true
});
const client = createClient(CalculatorService, transport);

export default function Home() {
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [operator, setOperator] = useState('+');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [activeInput, setActiveInput] = useState('num1'); // 新增焦点状态
    const [loading, setLoading] = useState(false);
    // 数字按钮处理
    const handleNumber = (number) => {
        const currentValue = activeInput === 'num1' ? num1 : num2;
        // 禁止重复小数点
        if (number === '.' && currentValue.includes('.')) return;
        // 禁止以多个0开头
        if (number === '0' && currentValue === '0') return;
        // 更新状态
        if (activeInput === 'num1') {
            setNum1(prev => prev === '0' ? number : prev + number);
        } else {
            setNum2(prev => prev === '0' ? number : prev + number);
        }
    };

    // 操作符按钮处理
    const handleOperator = (op) => {
        setOperator(op);
        setActiveInput('num2');
    };
    const handleCalculate = async () => {
        if (num1 === '' || num2 === '') {
            setError('请输入数字');
            return;
        }

        try {
            setLoading(true); // 开始加载
            const req = new CalculateRequest({
                num1: parseFloat(num1),
                num2: parseFloat(num2),
                operator: operator,
            });
            const res = await client.calculate(req);
            setResult(res.result);
            setError(null);
        } catch (err) {
            setResult(null);
            setError('计算出错，请检查输入');
            console.error('计算出错:', err);
        } finally {
            setLoading(false); // 结束加载
        }
    };

    const handleClear = () => {
        setNum1('');
        setNum2('');
        setOperator('+');
        setResult(null);
        setError(null);
        setActiveInput('num1');
    };


    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>计算中...</p>
                </div>
            )}
            <div className="calculator-container">
                <div className="calculator-box">
                    <h1 className="calculator-title">
                        <span className="gradient-text">计算器</span>
                    </h1>

                    {/* 输入显示区 */}
                    <div className="input-section">
                        <div className="input-group">
                            <input
                                type="number"
                                value={num1}
                                onChange={(e) => setNum1(e.target.value)}
                                onFocus={() => setActiveInput('num1')}
                                className={`num-input ${activeInput === 'num1' ? 'active-input' : ''}`}
                                placeholder="数字 1"
                            />
                            <div className="operator-display">{operator}</div>
                            <input
                                type="number"
                                value={num2}
                                onChange={(e) => setNum2(e.target.value)}
                                onFocus={() => setActiveInput('num2')}
                                className={`num-input ${activeInput === 'num2' ? 'active-input' : ''}`}
                                placeholder="数字 2"
                            />
                        </div>

                        {/* 按钮面板 */}
                        <div className="button-grid">
                            {/* 数字按钮 */}
                            {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'].map(num => (
                                <button
                                    key={num}
                                    className="num-btn"
                                    onClick={() => handleNumber(num.toString())}
                                >
                                    {num}
                                </button>
                            ))}

                            {/* 操作符按钮 */}
                            {['+', '-', '*', '/'].map(op => (
                                <button
                                    key={op}
                                    className={`operator-btn ${operator === op ? 'active-operator' : ''}`}
                                    onClick={() => handleOperator(op)}
                                >
                                    {op}
                                </button>
                            ))}

                            {/* 计算按钮 */}
                            <button
                                className="calculate-btn"
                                onClick={handleCalculate}
                                style={{gridColumn: 'span 2'}} // 行内样式控制跨列
                            >
                                ＝ 计算
                            </button>
                            <button
                                className="clear-btn"
                                onClick={handleClear}
                            >
                                C
                            </button>
                        </div>
                    </div>

                    {/* 结果和错误提示保持结构不变，仅修改类名 */}
                    {result !== null && (
                        <div className="result-box fade-in">
                            <p>📐 计算结果: {result}</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-box shake-animation">
                            {/* 错误图标保持原样 */}
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}