# Test Project

## Goal
To run chess_db in kubernetes on home cluster to prove that i'm the best chess player in my office.
also to learn how to create volumes in kubernetes and learn how to protect API with tokens.

## References
- (**docker cli reference**)[https://docs.docker.com/reference/cli/docker/]
- (**dockerfile reference**)[https://docs.docker.com/reference/dockerfile/]
- (**docker build guide**)[https://docs.docker.com/build/guide]
- (**kubectl reference**)[https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands]
- (**MiniKube**)[https://minikube.sigs.k8s.io/docs/start/]
- (**Nginx Proxy**)[https://docs.nginx.com/nginx/admin-guide/]
## Useful Commands

## Test

#### to test 
```bash
npm start ## start the web server

```

#### to test dockers container
```bash
docker build -t cdb .
docker run -it cdb sh
docker run -dp 80:80 cdb
```

#### Ingress 
- apply manifest
```bash
kubectl apply -f ./manifest.yaml
kubectl get ingress
NAME              CLASS   HOSTS   ADDRESS        PORTS   AGE
example-ingress   nginx   *       192.168.49.2   80      3d4h
```

#### Nginx Load Balancer
```bash
systemctl status nginx # check status
sudo vim  /etc/nginx/nginx.conf
sudo systemctl reload nginx
```

- test service: (in browser)
`http://82.166.86.139:3000/chess-db`


#### Troubleshoot
##### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
```
##### Ingress Logs
```bash
# Find all pod names in ingress-nginx namespace
mishmish@orchard ~/projects/test_project/K8s $ kubectl get pods -n ingress-nginx 
NAME                                        READY   STATUS      RESTARTS   AGE
ingress-nginx-admission-create-bqct7        0/1     Completed   0          3d6h
ingress-nginx-admission-patch-lg849         0/1     Completed   0          3d6h
ingress-nginx-controller-7c6974c4d8-dqgr4   1/1     Running     0          3d6h

# get logs of nginx-controller pod
kubectl logs -f ingress-nginx-controller-7c6974c4d8-dqgr4 -n ingress-nginx 
```

##### Pod Logs
```bash
# Find all pod names
mishmish@orchard ~/projects/test_project/K8s $ kubectl get pods
NAME                              READY   STATUS    RESTARTS   AGE
balanced-dc9897bb7-sks5s          1/1     Running   0          3d6h
balanced2-f55647f45-dfg7t         1/1     Running   0          3d6h
bar-app                           1/1     Running   0          3d5h
foo-app                           1/1     Running   0          3d5h
hello-minikube-7f54cff968-xpftm   1/1     Running   0          3d16h
ui-app                            1/1     Running   0          45m

# get logs of specific pod
mishmish@orchard ~/projects/test_project/K8s $ kubectl logs ui-app
INFO:     Will watch for changes in these directories: ['/app/backend']
INFO:     Uvicorn running on http://0.0.0.0:80 (Press CTRL+C to quit)
INFO:     Started reloader process [1] using WatchFiles
INFO:     Started server process [9]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```


#### exec into pod
```bash
kubectl exec -it ui-app -- /bin/sh
```
