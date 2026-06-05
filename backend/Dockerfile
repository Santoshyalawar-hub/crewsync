# Use lightweight Java 17 JDK base image
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the built jar file from Maven target folder
COPY target/samayahr-0.0.1-SNAPSHOT.jar app.jar

# Expose the port Spring Boot runs on (default 8080)
EXPOSE 8080

# Command to run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]