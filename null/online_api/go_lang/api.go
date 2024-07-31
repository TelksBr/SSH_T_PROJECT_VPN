package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"time"
	"io/ioutil"
)

const (
	PORT         = ":2095"
	ONLINE_FILE  = "online.txt"
	AUTH_TOKEN   = "b2c1f84a1d3e92f63e1d73c7e55b8a19a93d5b405c5d88f7f367e27c084df0a7"
)

func main() {
	http.HandleFunc("/online", authenticateToken(getOnlineHandler))

	go updateOnlineFilePeriodically()

	log.Printf("Servidor API rodando na porta %s", PORT)
	log.Fatal(http.ListenAndServe(PORT, nil))
}

func authenticateToken(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := r.URL.Query().Get("token")
		if token != AUTH_TOKEN {
			http.Error(w, "Acesso negado. Token inválido.", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	}
}

func getOnlineHandler(w http.ResponseWriter, r *http.Request) {
	onlineUsers, err := getOnlineFromFile()
	if err != nil {
		http.Error(w, "Erro ao obter o número de usuários online", http.StatusInternalServerError)
		return
	}

	response := map[string]int{"onlineUsers": onlineUsers}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Erro ao processar a resposta", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func updateOnlineFilePeriodically() {
	for {
		updateOnlineFile()
		time.Sleep(1 * time.Minute)
	}
}

func updateOnlineFile() {
	cmd := exec.Command("sh", "-c", "ps -x | grep sshd | grep -v root | grep priv | wc -l")
	output, err := cmd.Output()
	if err != nil {
		log.Printf("Erro ao executar o comando para obter usuários SSH: %v", err)
		return
	}

	onlineUsers := strings.TrimSpace(string(output))
	err = ioutil.WriteFile(filepath.Join(".", ONLINE_FILE), []byte(onlineUsers), 0644)
	if err != nil {
		log.Printf("Erro ao escrever no arquivo: %v", err)
		return
	}

	log.Println("Número de usuários SSH atualizado no arquivo.")
}

func getOnlineFromFile() (int, error) {
	data, err := ioutil.ReadFile(filepath.Join(".", ONLINE_FILE))
	if err != nil {
		log.Printf("Erro ao ler o número de usuários online do arquivo: %v", err)
		return 0, err
	}

	onlineUsers, err := strconv.Atoi(strings.TrimSpace(string(data)))
	if err != nil {
		log.Printf("Erro ao converter o número de usuários online: %v", err)
		return 0, err
	}

	return onlineUsers, nil
}
