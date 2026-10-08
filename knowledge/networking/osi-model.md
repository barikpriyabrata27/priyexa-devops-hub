# OSI and TCP/IP

> **Name the layer you are debugging. A DNS failure and a closed port are not the same incident, and they do not share a fix.**

The OSI model is a teaching stack. Packets do not carry a layer number. It is still the fastest way to stop a room from arguing about three different faults at once.

```text
7  Application     HTTP, DNS query content, gRPC, the status code
6  Presentation    TLS, encoding, compression
5  Session         the idea of a conversation; mostly absorbed by TCP and TLS today
4  Transport       TCP, UDP, ports, retransmission
3  Network         IP addresses, routing, fragmentation
2  Data link       Ethernet, MAC addresses, the local segment, ARP
1  Physical        cable, NIC, the signal; rare in cloud, common in a rack
```

The TCP/IP model collapses this into fewer names, and it is what implementations actually follow.

```text
Application     HTTP, DNS, SSH          OSI 5–7
Transport       TCP, UDP                OSI 4
Internet        IP, ICMP                OSI 3
Link            Ethernet, Wi-Fi         OSI 1–2
```

Interview answers can use either model. Say which one you are using. "Layer 7" means the application protocol. "Layer 4" means ports and TCP or UDP. "Layer 3" means IP routing.

## What each layer can prove

```text
ping (ICMP)          layer 3 might be up; TCP on port 443 can still be blocked
TCP connect          layers 3 and 4 worked for that port
TLS handshake        you reached something that speaks TLS, maybe the wrong host
HTTP 200             the application answered; dependencies might still be down
```

`ping` is a weak test. Many networks drop ICMP and still serve HTTPS. A failed ping does not mean the service is down. A successful ping does not mean the service is up.

## A request, top to bottom

A browser asks for `https://app.example.com`.

1. DNS (application) turns the name into an address.
2. Routing (network) sends the packet toward that address, hop by hop.
3. TCP (transport) opens a connection to port 443.
4. TLS (presentation) agrees a certificate and keys.
5. HTTP (application) sends `GET /` and reads a status code.

Stop at the first step that fails. Looking at application logs while DNS returns `NXDOMAIN` wastes the incident.

## Encapsulation

Each layer wraps the one above it. HTTP sits inside TLS, inside TCP, inside IP, inside an Ethernet frame. A load balancer can look at IP and port (layer 4) or open the HTTP request (layer 7). It cannot see the HTTP path if it does not terminate TLS, unless the client and the balancer use a design that exposes it. That is why "just route `/api` somewhere else" requires a layer-7 proxy that can read the request.
