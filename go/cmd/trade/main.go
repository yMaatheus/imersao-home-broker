package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
	"github.com/yMaatheus/imersao-home-broker/go/internal/infra/kafka"
	"github.com/yMaatheus/imersao-home-broker/go/internal/market/dto"
	"github.com/yMaatheus/imersao-home-broker/go/internal/market/entity"
	"github.com/yMaatheus/imersao-home-broker/go/internal/market/transformer"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Some error occured. Err: %s", err)
	}

	broker := os.Getenv("KAFKA_HOST")
	kafka_username := os.Getenv("KAFKA_USERNAME")
	kafka_password := os.Getenv("KAFKA_PASSWORD")
	ordersIn := make(chan *entity.Order)
	ordersOut := make(chan *entity.Order)
	wg := &sync.WaitGroup{}
	defer wg.Wait()

	kafkaMsgChan := make(chan *ckafka.Message)
	configMap := &ckafka.ConfigMap{
		// "bootstrap.servers": "host.docker.internal:9094",
		"bootstrap.servers":  broker,
		"security.protocol":  "SASL_SSL",
		"sasl.mechanisms":    "PLAIN",
		"sasl.username":      kafka_username,
		"sasl.password":      kafka_password,
		"group.id":           "myGroup",
		"auto.offset.reset":  "latest",
		"session.timeout.ms": 45000,
	}
	producer := kafka.NewKafkaProducer(configMap)
	kafka := kafka.NewConsumer(configMap, []string{"input"})

	go kafka.Consume(kafkaMsgChan)

	book := entity.NewBook(ordersIn, ordersOut, wg)
	go book.Trade()

	go func() {
		for msg := range kafkaMsgChan {
			wg.Add(1)
			fmt.Println(string(msg.Value))
			tradeInput := dto.TradeInput{}
			err := json.Unmarshal(msg.Value, &tradeInput)
			if err != nil {
				panic(err)
			}
			order := transformer.TransformInput(tradeInput)
			ordersIn <- order
		}
	}()

	println("App started!")

	for res := range ordersOut {
		output := transformer.TransformOutput(res)
		outputJson, err := json.MarshalIndent(output, "", "   ")
		fmt.Println(string(outputJson))
		if err != nil {
			fmt.Println(err)
		}
		producer.Publish(outputJson, []byte("orders"), "output")
	}
}
