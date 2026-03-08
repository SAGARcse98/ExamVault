"use client";

import { useState } from "react";
import { Calculator, Table, Grid3x3, Zap, Hash, ArrowRight } from "lucide-react";

type TabType = "calculator" | "table" | "squares" | "powers";

export default function CalculatorPage() {
    const [activeTab, setActiveTab] = useState<TabType>("calculator");

    // Calculator state
    const [display, setDisplay] = useState("0");
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    // Generator state
    const [tableNum, setTableNum] = useState("12");
    const [tableRange, setTableRange] = useState("10");
    const [squareRange, setSquareRange] = useState("30");
    const [powerBase, setPowerBase] = useState("2");
    const [powerMax, setPowerMax] = useState("12");

    const tabs = [
        { key: "calculator", label: "Calculator", icon: Calculator },
        { key: "table", label: "Table Generator", icon: Table },
        { key: "squares", label: "Squares & Cubes", icon: Grid3x3 },
        { key: "powers", label: "Powers", icon: Zap },
    ];

    // Calculator functions
    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === "0" ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay("0.");
            setWaitingForOperand(false);
            return;
        }
        if (!display.includes(".")) setDisplay(display + ".");
    };

    const handleOperator = (nextOp: string) => {
        const current = parseFloat(display);
        if (prevValue !== null && !waitingForOperand) {
            let result = 0;
            switch (operator) {
                case "+": result = prevValue + current; break;
                case "-": result = prevValue - current; break;
                case "×": result = prevValue * current; break;
                case "÷": result = current !== 0 ? prevValue / current : 0; break;
                case "%": result = prevValue % current; break;
                default: result = current;
            }
            setDisplay(String(result));
            setPrevValue(result);
        } else {
            setPrevValue(current);
        }
        setOperator(nextOp);
        setWaitingForOperand(true);
    };

    const calculate = () => {
        if (prevValue === null || operator === null) return;
        const current = parseFloat(display);
        let result = 0;
        switch (operator) {
            case "+": result = prevValue + current; break;
            case "-": result = prevValue - current; break;
            case "×": result = prevValue * current; break;
            case "÷": result = current !== 0 ? prevValue / current : 0; break;
            case "%": result = prevValue % current; break;
        }
        setDisplay(String(result));
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(true);
    };

    const clearAll = () => {
        setDisplay("0");
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const calcButtons = [
        ["C", "±", "%", "÷"],
        ["7", "8", "9", "×"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        ["0", ".", "⌫", "="],
    ];

    const handleCalcButton = (btn: string) => {
        if (btn >= "0" && btn <= "9") inputDigit(btn);
        else if (btn === ".") inputDecimal();
        else if (btn === "C") clearAll();
        else if (btn === "±") setDisplay(String(-parseFloat(display)));
        else if (btn === "⌫") setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
        else if (btn === "=") calculate();
        else handleOperator(btn);
    };

    // Generators
    const generateTable = () => {
        const num = parseInt(tableNum) || 0;
        const range = parseInt(tableRange) || 10;
        return Array.from({ length: range }, (_, i) => ({
            multiplier: i + 1,
            result: num * (i + 1),
        }));
    };

    const generateSquaresCubes = () => {
        const range = parseInt(squareRange) || 20;
        return Array.from({ length: range }, (_, i) => ({
            num: i + 1,
            square: (i + 1) ** 2,
            cube: (i + 1) ** 3,
        }));
    };

    const generatePowers = () => {
        const base = parseInt(powerBase) || 2;
        const max = parseInt(powerMax) || 10;
        return Array.from({ length: max }, (_, i) => ({
            power: i + 1,
            result: base ** (i + 1),
        }));
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                    Smart Calculator
                </h2>
                <p style={{ color: "#64748B", fontSize: 15 }}>
                    Calculator, table generator, squares, cubes, and power tools
                </p>
            </div>

            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 24,
                    background: "white",
                    padding: 6,
                    borderRadius: 14,
                    border: "1px solid #E2E8F0",
                    overflowX: "auto",
                }}
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as TabType)}
                            style={{
                                padding: "10px 18px",
                                borderRadius: 10,
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 13,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                whiteSpace: "nowrap",
                                background: activeTab === tab.key ? "#4F46E5" : "transparent",
                                color: activeTab === tab.key ? "white" : "#64748B",
                                transition: "all 0.2s",
                            }}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Calculator */}
            {activeTab === "calculator" && (
                <div style={{ maxWidth: 380, margin: "0 auto" }}>
                    <div
                        style={{
                            background: "white",
                            borderRadius: 24,
                            padding: 24,
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
                        }}
                    >
                        {/* Display */}
                        <div
                            style={{
                                background: "#0F172A",
                                borderRadius: 16,
                                padding: "20px 24px",
                                marginBottom: 20,
                                textAlign: "right",
                            }}
                        >
                            {operator && prevValue !== null && (
                                <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 4 }}>
                                    {prevValue} {operator}
                                </p>
                            )}
                            <p style={{ fontSize: 36, fontWeight: 700, color: "white", fontFamily: "'Inter', monospace" }}>
                                {display}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                            {calcButtons.flat().map((btn) => {
                                const isOperator = ["÷", "×", "-", "+", "%"].includes(btn);
                                const isEquals = btn === "=";
                                const isClear = btn === "C";
                                return (
                                    <button
                                        key={btn}
                                        onClick={() => handleCalcButton(btn)}
                                        style={{
                                            padding: "16px 0",
                                            borderRadius: 14,
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: 20,
                                            fontWeight: 600,
                                            background: isEquals
                                                ? "linear-gradient(135deg, #4F46E5, #06B6D4)"
                                                : isOperator
                                                    ? "#EEF2FF"
                                                    : isClear
                                                        ? "#FEE2E2"
                                                        : "#F8FAFC",
                                            color: isEquals ? "white" : isOperator ? "#4F46E5" : isClear ? "#EF4444" : "#0F172A",
                                            transition: "all 0.15s",
                                            gridColumn: btn === "0" ? "span 1" : undefined,
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.target as HTMLElement).style.transform = "scale(0.95)";
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.target as HTMLElement).style.transform = "scale(1)";
                                        }}
                                    >
                                        {btn}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Table Generator */}
            {activeTab === "table" && (
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <div
                        style={{
                            background: "white",
                            borderRadius: 20,
                            padding: 28,
                            border: "1px solid #E2E8F0",
                        }}
                    >
                        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                    Enter Number
                                </label>
                                <input
                                    type="number"
                                    value={tableNum}
                                    onChange={(e) => setTableNum(e.target.value)}
                                    className="input-styled"
                                    id="table-number"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                    Range (up to)
                                </label>
                                <input
                                    type="number"
                                    value={tableRange}
                                    onChange={(e) => setTableRange(e.target.value)}
                                    className="input-styled"
                                    id="table-range"
                                />
                            </div>
                        </div>

                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
                            Table of {tableNum}
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                            {generateTable().map((row) => (
                                <div
                                    key={row.multiplier}
                                    style={{
                                        padding: "10px 16px",
                                        background: "#F8FAFC",
                                        borderRadius: 10,
                                        fontSize: 15,
                                        fontWeight: 500,
                                        color: "#334155",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <span style={{ color: "#4F46E5", fontWeight: 700, minWidth: 24 }}>{tableNum}</span>
                                    <span style={{ color: "#94A3B8" }}>×</span>
                                    <span style={{ minWidth: 24, textAlign: "center" }}>{row.multiplier}</span>
                                    <span style={{ color: "#94A3B8" }}>=</span>
                                    <span style={{ fontWeight: 700, color: "#10B981" }}>{row.result}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Squares & Cubes */}
            {activeTab === "squares" && (
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <div
                        style={{
                            background: "white",
                            borderRadius: 20,
                            padding: 28,
                            border: "1px solid #E2E8F0",
                        }}
                    >
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                Generate squares & cubes from 1 to:
                            </label>
                            <input
                                type="number"
                                value={squareRange}
                                onChange={(e) => setSquareRange(e.target.value)}
                                className="input-styled"
                                style={{ maxWidth: 200 }}
                                id="square-range"
                            />
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table className="table-styled">
                                <thead>
                                    <tr>
                                        <th>n</th>
                                        <th>n²</th>
                                        <th>n³</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generateSquaresCubes().map((row) => (
                                        <tr key={row.num}>
                                            <td style={{ fontWeight: 700, color: "#4F46E5" }}>{row.num}</td>
                                            <td style={{ fontWeight: 600 }}>{row.square}</td>
                                            <td style={{ fontWeight: 600, color: "#06B6D4" }}>{row.cube}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Powers */}
            {activeTab === "powers" && (
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                    <div
                        style={{
                            background: "white",
                            borderRadius: 20,
                            padding: 28,
                            border: "1px solid #E2E8F0",
                        }}
                    >
                        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                    Base Number
                                </label>
                                <input
                                    type="number"
                                    value={powerBase}
                                    onChange={(e) => setPowerBase(e.target.value)}
                                    className="input-styled"
                                    id="power-base"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                                    Max Power
                                </label>
                                <input
                                    type="number"
                                    value={powerMax}
                                    onChange={(e) => setPowerMax(e.target.value)}
                                    className="input-styled"
                                    id="power-max"
                                />
                            </div>
                        </div>

                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
                            Powers of {powerBase}
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                            {generatePowers().map((row) => (
                                <div
                                    key={row.power}
                                    style={{
                                        padding: "12px 16px",
                                        background: "#F8FAFC",
                                        borderRadius: 10,
                                        fontSize: 15,
                                        fontWeight: 500,
                                        color: "#334155",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <span style={{ color: "#4F46E5", fontWeight: 700 }}>{powerBase}</span>
                                    <sup style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700 }}>{row.power}</sup>
                                    <span style={{ color: "#94A3B8" }}>=</span>
                                    <span style={{ fontWeight: 700, color: "#10B981" }}>{row.result.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
