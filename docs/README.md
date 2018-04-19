# 188.475 - Digital Preservation - SS18 - Lab 1.2

- Georg Hagmann, 01226641
- Alexander Rashed, 01325897

#### Description

This frontend application allows to easily create a human-readable as well as a machine-actionable data management plan.

**TODO:**
- **Describe TISS**
- **Describe OpenDOAR**
- **Describe mime type repo mapping**
- **Describe repo issue (max 30 + no filter on repo type), which causes the problem that sometimes there can be less than 3 repos**
- **Add workflow description / screenshots**
- **Describe that it's completely client-side**

#### Execute

If you don't want to use the docker setup, follow these steps to start a local development server:
```bash
npm install
npm start # don't use ng serve (as this does not automatically configure the API proxy configuration)
```

#### Docker

- Build the image:
  ```bash
  docker build --tag dpue .
  ```
- Execute the script (and mount the folder where you want to store the results at `/usr/src/app/output`):
  ```bash
  docker run --rm -p80:80 dpue
  ```
- Go to [localhost](http://localhost:80).

#### License of this work: [MIT](https://opensource.org/licenses/MIT)
