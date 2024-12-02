"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[159],{26198:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>h,contentTitle:()=>c,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>p});const a=JSON.parse('{"id":"content/getting-started/install-sdk","title":"Install SDK Client","description":"Installing SDK client","source":"@site/docs/content/getting-started/install-sdk.mdx","sourceDirName":"content/getting-started","slug":"/getting-started/install-sdk","permalink":"/pr-preview/pr-906/docs/getting-started/install-sdk","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/install-sdk.mdx","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"title":"Install SDK Client","sidebar_position":2,"slug":"/getting-started/install-sdk","description":"Installing SDK client"},"sidebar":"docs","previous":{"title":"Playground","permalink":"/pr-preview/pr-906/docs/getting-started/setup-openfga/playground"},"next":{"title":"Create a Store","permalink":"/pr-preview/pr-906/docs/getting-started/create-store"}}');var l=s(74848),t=s(28453),i=s(89987),r=s(11470),d=s(19365);const o={title:"Install SDK Client",sidebar_position:2,slug:"/getting-started/install-sdk",description:"Installing SDK client"},c="Install SDK Client",h={},p=[{value:"Brew",id:"brew",level:3},{value:"Linux (deb, rpm and apk) packages",id:"linux-deb-rpm-and-apk-packages",level:3},{value:"Docker",id:"docker",level:3},{value:"Go",id:"go",level:3},{value:"Manually",id:"manually",level:3},{value:"Related Sections",id:"related-sections",level:2}];function g(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.header,{children:(0,l.jsx)(n.h1,{id:"install-sdk-client",children:"Install SDK Client"})}),"\n",(0,l.jsx)(i.ZE,{}),"\n",(0,l.jsxs)(n.p,{children:["To get started, install the ",(0,l.jsx)(i.bU,{format:i.Ed.ShortForm})," SDK packages."]}),"\n",(0,l.jsxs)(r.A,{groupId:"languages",children:[(0,l.jsxs)(d.A,{value:i.NH.JS_SDK,label:i.px.get(i.NH.JS_SDK),children:[(0,l.jsxs)(n.p,{children:["You can find the Node.js package on npm at: ",(0,l.jsx)(n.a,{href:"https://www.npmjs.com/package/@openfga/sdk",children:"@openfga/sdk"}),"."]}),(0,l.jsxs)(n.p,{children:["Using ",(0,l.jsx)(n.a,{href:"https://www.npmjs.com/",children:"npm"}),":"]}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"npm install @openfga/sdk\n"})}),(0,l.jsxs)(n.p,{children:["Using ",(0,l.jsx)(n.a,{href:"https://yarnpkg.com",children:"yarn"}),":"]}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"yarn add @openfga/sdk\n"})})]}),(0,l.jsxs)(d.A,{value:i.NH.GO_SDK,label:i.px.get(i.NH.GO_SDK),children:[(0,l.jsxs)(n.p,{children:["You can find the Go package on GitHub at: ",(0,l.jsx)(n.a,{href:"https://github.com/openfga/go-sdk",children:"@openfga/go-sdk"}),"."]}),(0,l.jsx)(n.p,{children:"To install:"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"go get -u github.com/openfga/go-sdk\n"})}),(0,l.jsx)(n.p,{children:"In your code, import the module and use it:"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-go",children:'import (\n    openfga "github.com/openfga/go-sdk"\n)\n\nfunc main() {\n    configuration, err := openfga.NewConfiguration(openfga.Configuration{\n        ApiUrl:               os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example\n    })\n\n    if err != nil {\n        // .. Handle error\n    }\n}\n'})}),(0,l.jsx)(n.p,{children:"You can then run"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"go mod tidy\n"})}),(0,l.jsxs)(n.p,{children:["to update ",(0,l.jsx)(n.code,{children:"go.mod"})," and ",(0,l.jsx)(n.code,{children:"go.sum"})," if you are using them."]})]}),(0,l.jsxs)(d.A,{value:i.NH.DOTNET_SDK,label:i.px.get(i.NH.DOTNET_SDK),children:[(0,l.jsxs)(n.p,{children:["The ",(0,l.jsx)(i.bU,{format:i.Ed.ShortForm})," .NET SDK is available on ",(0,l.jsx)(n.a,{href:"https://www.nuget.org/packages/OpenFga.Sdk",children:"NuGet"}),"."]}),(0,l.jsx)(n.p,{children:"You can install it using:"}),(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["The ",(0,l.jsx)(n.a,{href:"https://docs.microsoft.com/en-us/nuget/consume-packages/install-use-packages-dotnet-cli",children:"dotnet CLI"}),":"]}),"\n"]}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-powershell",children:"dotnet add package OpenFGA.Sdk\n"})}),(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["The ",(0,l.jsx)(n.a,{href:"https://docs.microsoft.com/en-us/nuget/consume-packages/install-use-packages-powershell",children:"Package Manager Console"})," inside Visual Studio:"]}),"\n"]}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-powershell",children:"Install-Package OpenFGA.Sdk\n"})}),(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.a,{href:"https://docs.microsoft.com/en-us/nuget/consume-packages/install-use-packages-visual-studio",children:"Visual Studio"}),", ",(0,l.jsx)(n.a,{href:"https://docs.microsoft.com/en-us/visualstudio/mac/nuget-walkthrough",children:"Visual Studio for Mac"})," and ",(0,l.jsx)(n.a,{href:"https://www.jetbrains.com/help/rider/Using_NuGet.html",children:"IntelliJ Rider"}),": Search for and install ",(0,l.jsx)(n.code,{children:"OpenFGA.Sdk"})," in each of their respective package manager UIs."]}),"\n"]})]}),(0,l.jsxs)(d.A,{value:i.NH.PYTHON_SDK,label:i.px.get(i.NH.PYTHON_SDK),children:[(0,l.jsxs)(n.p,{children:["The ",(0,l.jsx)(i.bU,{format:i.Ed.ShortForm})," Python SDK is available on ",(0,l.jsx)(n.a,{href:"https://pypi.org/project/openfga-sdk",children:"PyPI"}),"."]}),(0,l.jsx)(n.p,{children:"To install:"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"pip3 install openfga_sdk\n"})}),(0,l.jsx)(n.p,{children:"In your code, import the module and use it:"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-python",children:"import openfga_sdk\n"})})]}),(0,l.jsxs)(d.A,{value:i.NH.JAVA_SDK,label:i.px.get(i.NH.JAVA_SDK),children:[(0,l.jsxs)(n.p,{children:["You can find the Java package on ",(0,l.jsx)(n.a,{href:"https://central.sonatype.com/artifact/dev.openfga/openfga-sdk",children:"Maven Central"}),"."]}),(0,l.jsxs)(n.p,{children:["Using ",(0,l.jsx)(n.a,{href:"https://maven.apache.org/",children:"Maven"}),":"]}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{children:"<dependency>\n    <groupId>dev.openfga</groupId>\n    <artifactId>openfga-sdk</artifactId>\n    <version>0.3.1</version>\n</dependency>\n"})}),(0,l.jsxs)(n.p,{children:["Using ",(0,l.jsx)(n.a,{href:"https://gradle.org/",children:"Gradle"}),":"]}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-groovy",children:"implementation 'dev.openfga:openfga-sdk:0.3.1'\n"})})]}),(0,l.jsxs)(d.A,{value:i.NH.CLI,label:i.px.get(i.NH.CLI),children:[(0,l.jsxs)(n.p,{children:["The ",(0,l.jsx)(i.bU,{format:i.Ed.ShortForm})," CLI is available on ",(0,l.jsx)(n.a,{href:"https://github.com/openfga/cli",children:"GitHub"}),"."]}),(0,l.jsx)(n.p,{children:"To install:"}),(0,l.jsx)(n.h3,{id:"brew",children:"Brew"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"brew install openfga/tap/fga\n"})}),(0,l.jsx)(n.h3,{id:"linux-deb-rpm-and-apk-packages",children:"Linux (deb, rpm and apk) packages"}),(0,l.jsxs)(n.p,{children:["Download the .deb, .rpm or .apk packages from the ",(0,l.jsx)(n.a,{href:"https://github.com/openfga/cli/releases",children:"releases page"}),"."]}),(0,l.jsx)(n.p,{children:"Debian:"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"sudo apt install ./fga_<version>_linux_<arch>.deb\n"})}),(0,l.jsx)(n.p,{children:"Fedora:"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"sudo dnf install ./fga_<version>_linux_<arch>.rpm\n"})}),(0,l.jsx)(n.p,{children:"Alpine Linux:"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"sudo apk add --allow-untrusted ./fga_<version>_linux_<arch>.apk\n"})}),(0,l.jsx)(n.h3,{id:"docker",children:"Docker"}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"docker pull openfga/cli; docker run -it openfga/cli\n"})}),(0,l.jsx)(n.h3,{id:"go",children:"Go"}),(0,l.jsxs)(n.blockquote,{children:["\n",(0,l.jsxs)(n.p,{children:["note that the command will be named ",(0,l.jsx)(n.code,{children:"cli"})]}),"\n"]}),(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-shell",children:"go install github.com/openfga/cli@latest\n"})}),(0,l.jsx)(n.h3,{id:"manually",children:"Manually"}),(0,l.jsxs)(n.p,{children:["Download the pre-compiled binaries from the ",(0,l.jsx)(n.a,{href:"https://github.com/openfga/cli/releases",children:"releases page"}),"."]})]})]}),"\n",(0,l.jsx)(i.OK,{section:"what-is-a-check-request",linkName:"check API"}),"\n",(0,l.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,l.jsx)(i.XQ,{description:"Get {ProductName}'s SDKs to add authorization to your API.",relatedLinks:[{title:"{ProductName} Node.js SDK",description:"Install our Node.js & JavaScript SDK to get started.",link:"https://www.npmjs.com/package/@openfga/sdk"},{title:"{ProductName} Go SDK",description:"Use our Go SDK to easily connect your Go application to the {ProductName} API",link:"https://github.com/openfga/go-sdk"},{title:"{ProductName} .NET SDK",description:"Connect your .NET service with {ProductName} using our .NET SDK",link:"https://github.com/openfga/dotnet-sdk"},{title:"{ProductName} Python SDK",description:"Connect your Python service with {ProductName} using our Python SDK",link:"https://github.com/openfga/python-sdk"},{title:"{ProductName} Java SDK",description:"Connect your Java service with {ProductName} using our Java SDK",link:"https://github.com/openfga/java-sdk"}]})]})}function u(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(g,{...e})}):g(e)}}}]);