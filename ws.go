package main

import (
	"fmt"
	"net/http"

	"golang.org/x/net/websocket"
)

func main() {
	http.Handle("/", websocket.Handler(HandleClient))
	err := http.ListenAndServe(":8081", nil) // starts an HTTP server with a given address and handler
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}

func createSnake(name, color, list_pos) {
}

func HandleClient(ws *websocket.Conn) {
	var content string
	for {
		err := websocket.Message.Receive(ws, &content)
		fmt.Println("Message: ")
		fmt.Println(string(content))

		if err != nil {
			fmt.Println(err)
			return
		}

		ws.Write([]byte(content))
	}
} // https://scotch.io/bar-talk/build-a-realtime-chat-server-with-go-and-websockets
