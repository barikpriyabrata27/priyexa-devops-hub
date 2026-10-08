# HTTP and TLS

> **Once TCP is up, the next failures are certificates and status codes. A 502 means you reached a proxy. It does not mean the client failed DNS.**

```text
client ──TCP 443──▶ load balancer ──TCP──▶ app
         TLS                 TLS or plain HTTP behind it
         HTTP
```

Many load balancers terminate TLS. The certificate the browser checks is the balancer's certificate, not the application's. A backend with an expired cert is invisible to the browser and fatal to the balancer. Know which hop validates which certificate.

## Status codes worth memorizing

```text
200     the application accepted the request; it can still be wrong
301     permanent redirect; clients and caches will remember
302     temporary redirect
400     the client sent something the server rejects
401     not authenticated
403     authenticated, not allowed
404     this server has no such resource
408     the server gave up waiting for the client
429     too many requests; back off, do not tight-loop
500     the application threw
502     a proxy could not get a valid response from upstream
503     unavailable, often overloaded or draining
504     a proxy timed out waiting for upstream
```

`401` is "who are you?" `403` is "I know who you are, and no." Mixing them up sends people to the wrong system. `502` and `504` are proxy errors. Read the proxy log and the upstream log. The client log only shows the proxy's answer.

A health check that returns 200 while the database is down will keep a bad instance in rotation. Check the dependency you cannot serve without, or accept that the check only proves the process is running.

## TLS, enough to debug

The handshake agrees a protocol version, a cipher, and a certificate chain. The client checks that the certificate is signed by someone it trusts, that the name matches (SNI and the subject alternative name), and that it is not expired. A name mismatch is the classic result of pointing a new DNS name at an old listener that only has the old certificate.

```text
expired            clock skew or a renewal that did not reload the process
unknown issuer     a private CA was not installed on the client
name mismatch      the cert is for a different hostname
protocol error     one side is TLS 1.0 and the other refuses it
```

Renewal is not done when the file on disk changes. The process that loaded the old cert must reload, or it keeps serving the old one until restart. Automate that reload. Alert on expiry weeks ahead, not the morning of.

TLS terminates CPU. Putting it at a load balancer is normal. Putting it again between the balancer and every pod (mTLS) is a security choice with a cost in certificates, latency, and failure modes. Do it when the network between them is not trusted. See [authentication](../auth/README.md) for identity on top of the channel.

## Proxies and the client address

After a reverse proxy, the application sees the proxy's address unless the proxy adds `X-Forwarded-For` or the PROXY protocol and the application is configured to trust that hop. Trusting that header from the open internet lets clients spoof their address. Trust it only from your own proxy.

HTTP/2 multiplexes many streams on one TCP connection. One stalled packet stalls all of them. HTTP/3 runs over QUIC on UDP and avoids that. Networks that allow only TCP/443 break HTTP/3 silently and fall back, until a client does not fall back. Allow UDP/443 where you intend to serve HTTP/3.
