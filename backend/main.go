package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"todo-backend/database"
	"todo-backend/handlers"
)

func main() {
	database.InitDatabase()
	defer database.DB.Close()

	router := mux.NewRouter()
	
	// Health check endpoint for Railway
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")
	
	router.HandleFunc("/api/todos", handlers.GetTodos).Methods("GET")
	router.HandleFunc("/api/todos", handlers.CreateTodo).Methods("POST")
	router.HandleFunc("/api/todos/{id}", handlers.UpdateTodo).Methods("PUT")
	router.HandleFunc("/api/todos/{id}", handlers.DeleteTodo).Methods("DELETE")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"https://*.vercel.app",
			"https://vercel.app",
		},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

