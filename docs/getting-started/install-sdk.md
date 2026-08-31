---
title: "Install SDK Client"
description: "Installing SDK client"
canonical: "https://openfga.dev/docs/getting-started/install-sdk"
content_type: "documentation"
last_updated: "2026-08-31T13:15:17.000Z"
---

# Install SDK Client

To get started, install the OpenFGA SDK packages.

- Node.js
- Go
- .NET
- Python
- Java
- CLI

You can find the Node.js package on npm at: [@openfga/sdk](https://www.npmjs.com/package/@openfga/sdk).

Using [npm](https://www.npmjs.com/):

```
npm install @openfga/sdk
```

Using [yarn](https://yarnpkg.com):

```
yarn add @openfga/sdk
```

You can find the Go package on GitHub at: [@openfga/go-sdk](https://github.com/openfga/go-sdk).

To install:

```
go get -u github.com/openfga/go-sdk
```

In your code, import the module and use it:

```
import (

    openfga "github.com/openfga/go-sdk"

)



func main() {

    configuration, err := openfga.NewConfiguration(openfga.Configuration{

        ApiUrl:               os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example

    })



    if err != nil {

        // .. Handle error

    }

}
```

You can then run

```
go mod tidy
```

to update `go.mod` and `go.sum` if you are using them.

The OpenFGA .NET SDK is available on [NuGet](https://www.nuget.org/packages/OpenFga.Sdk).

You can install it using:

- The [dotnet CLI](https://docs.microsoft.com/en-us/nuget/consume-packages/install-use-packages-dotnet-cli):

```
dotnet add package OpenFGA.Sdk
```

- The [Package Manager Console](https://docs.microsoft.com/en-us/nuget/consume-packages/install-use-packages-powershell) inside Visual Studio:

```
Install-Package OpenFGA.Sdk
```

- [Visual Studio](https://docs.microsoft.com/en-us/nuget/consume-packages/install-use-packages-visual-studio), [Visual Studio for Mac](https://docs.microsoft.com/en-us/visualstudio/mac/nuget-walkthrough) and [IntelliJ Rider](https://www.jetbrains.com/help/rider/Using_NuGet.html): Search for and install `OpenFGA.Sdk` in each of their respective package manager UIs.

The OpenFGA Python SDK is available on [PyPI](https://pypi.org/project/openfga-sdk).

To install:

```
pip3 install openfga_sdk
```

In your code, import the module and use it:

```
import openfga_sdk
```

You can find the Java package on [Maven Central](https://central.sonatype.com/artifact/dev.openfga/openfga-sdk).

Using [Maven](https://maven.apache.org/):

```
<dependency>

    <groupId>dev.openfga</groupId>

    <artifactId>openfga-sdk</artifactId>

    <version>0.3.1</version>

</dependency>
```

Using [Gradle](https://gradle.org/):

```
implementation 'dev.openfga:openfga-sdk:0.3.1'
```

The OpenFGA CLI is available on [GitHub](https://github.com/openfga/cli).

To install:

### Brew

```
brew install openfga/tap/fga
```

### Linux (deb, rpm and apk) packages

Download the .deb, .rpm or .apk packages from the [releases page](https://github.com/openfga/cli/releases).

Debian:

```
sudo apt install ./fga_<version>_linux_<arch>.deb
```

Fedora:

```
sudo dnf install ./fga_<version>_linux_<arch>.rpm
```

Alpine Linux:

```
sudo apk add --allow-untrusted ./fga_<version>_linux_<arch>.apk
```

### Docker

```
docker pull openfga/cli; docker run -it openfga/cli
```

### Go

```
go install github.com/openfga/cli/cmd/fga@latest
```

### Manually

Download the pre-compiled binaries from the [releases page](https://github.com/openfga/cli/releases).

## Related Sections

Get OpenFGA's SDKs to add authorization to your API.

**OpenFGA Node.js SDK**

Install our Node.js & JavaScript SDK to get started.

- [More](https://www.npmjs.com/package/@openfga/sdk)

**OpenFGA Go SDK**

Use our Go SDK to easily connect your Go application to the OpenFGA API

- [More](https://github.com/openfga/go-sdk)

**OpenFGA .NET SDK**

Connect your .NET service with OpenFGA using our .NET SDK

- [More](https://github.com/openfga/dotnet-sdk)

**OpenFGA Python SDK**

Connect your Python service with OpenFGA using our Python SDK

- [More](https://github.com/openfga/python-sdk)

**OpenFGA Java SDK**

Connect your Java service with OpenFGA using our Java SDK

- [More](https://github.com/openfga/java-sdk)
