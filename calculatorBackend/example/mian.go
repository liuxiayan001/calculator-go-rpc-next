package main

import (
	"context"
	"log"
	"net/http"

	"connectrpc.com/connect"
	proto "example/calculator/proto"
	"example/calculator/proto/calculatorconnect"
)

type CalculatorServer struct {
	calculatorconnect.UnimplementedCalculatorServiceHandler
}

func (s *CalculatorServer) Calculate(ctx context.Context, req *connect.Request[proto.CalculateRequest]) (*connect.Response[proto.CalculateResponse], error) {
	num1 := req.Msg.GetNum1()
	num2 := req.Msg.GetNum2()
	operator := req.Msg.GetOperator()

	var result float64
	switch operator {
	case "+":
		result = num1 + num2
	case "-":
		result = num1 - num2
	case "*":
		result = num1 * num2
	case "/":
		if num2 == 0 {
			return nil, connect.NewError(connect.CodeInvalidArgument, nil)
		}
		result = num1 / num2
	default:
		return nil, connect.NewError(connect.CodeInvalidArgument, nil)
	}

	res := connect.NewResponse(&proto.CalculateResponse{
		Result: result,
	})
	return res, nil
}

// 新增 CORS 中间件
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, HEAD")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Connect-Protocol-Version")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()
	path, handler := calculatorconnect.NewCalculatorServiceHandler(&CalculatorServer{})

	// 包装 handler 添加 CORS 支持
	corsHandler := enableCORS(handler)
	mux.Handle(path, corsHandler)

	log.Println("Server is running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
