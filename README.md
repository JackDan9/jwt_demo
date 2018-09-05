# jwt_demo
## 代码验证——签发和验证JWT
- 在应用里实施使用基于JWT这种Token的身份验证方法，你可以先去找一个签发与验证JWT的功能包。无论你的后端应用使用的是什么样的程序语言，系统，或者框架，你应该都可以找到提供类似功能的包。
- 这里采用Node.js来进行代码验证。

------

### 准备项目
- 准备一个简单的Node.js项目
```
cd testWorkspace
mkdir jwt_demo
cd jwt_demo
npm init -y
```
- 效果图如下:

![init][1]

- 安装签发与验证JWT的功能包，这里使用的是[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)，在项目里面安装这个包。

- 效果图如下:

![jsonwebtoken_install][2]

- `package.json`效果图:

![jsonwebtoken_package][3]

------

### 签发JWT
 - 在项目里随便添加一个`.js`文件，比如`index.js`，在文件里添加下面这些代码:
 
```
const jwt = require('jsonwebtoken')

// token data token数据
const payload = {
    name: 'JackDan',
    admin: true
}

// secret 密钥
const secret = 'JUNJUNLOVEFENGFENG'

// 签发 token
const token = jwt.sign(payload, secret, {expiresIn: '36600days'})

// 输出签发的 Token
console.log(token)
```
- 非常简单，就是用了刚刚为项目安装的`jsonwebtoken`里面提供的`jwt.sign`功能，去签发一个token。这个sign方法需要三个参数:
    - 1、payload: 签发的token里面要包含的一些数据。
    - 2、secret: 签发token用的密钥，在验证token的时候同样需要用到这个密钥。
    - 3、options: 一些其他的选项。
- 在命令行下面，用node命令，执行一下项目里的`index.js`这个文件(node index.js)，会输出应用签发的token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmFja0RhbiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MzYxMzQxMzcsImV4cCI6NDY5ODM3NDEzN30.yuGHsgfJbg5ArbeVGKJENQOYuBsYFFLDbwiExkPSH_k
```
- 上面的Token内容并没有加密，所以如果用一些JWT解码功能，可以看到Token里面包含的内容，内容由三个部分组成，像这样:
```
// header
{
    "alg": "HS256",
    "typ": "JWT"
}

// payload
{ 
    name: 'JackDan', 
    admin: true, 
    iat: 1536134993, 
    exp: 4698374993 
}

// signature
yuGHsgfJbg5ArbeVGKJENQOYuBsYFFLDbwiExkPSH_k
```
- 假设用户通过某种身份验证，你就可以使用上面签发的Token的功能为用户签发一个Token。一般在客户端那里会把它保存在Cookie或者LocalStorage里面。
- 用户下次向我们的应用请求受保护资源的时候，可以在请求里带着我们给它签发的这个Token，后端应用收到请求，检查签名，如果验证通过确定这个Token是我们自己签发的，那就可以为用户响应回他需要的资源。

------

### 验证JWT
- 验证JWT的有效性，确定一下用户的JWT是我们自己签发的，首先要得到用户的这个JWT Token，然后用`jwt.verify`这个方法去做一下验证。这个方法是Node.js的jsonwebtoken这个包提供的，在其他的应用框架或者系统里，你可能会找到类似的方法来验证JWT。
- 打开项目中的index.js文件，添加如下代码:
```
// 验证 Token
jwt.verify(token, secret, (error, decoded) => {
    if (error) {
        console.log(error.message)
        return
    }
    console.log(decoded)
})
```
- 把要验证的Token数据，还有签发这个Token的时候用的那个密钥告诉verify这个方法，在一个回调里面有两个参数，error表示错误，decoded是解码之后的Token数据。
- 执行:
```
C:\projects\testWorkspace\jwt_demo>node index.js
```
- 输出数据:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmFja0RhbiIsImFkbWluIjp0cnVlLCJpYXQiOjE1MzYxMzQ5OTMsImV4cCI6NDY5ODM3NDk5M30.ELAlzPGVvjsK0kK1Yl1PArb0wS3860R6c7mqG-5M4eY
{ name: 'JackDan', admin: true, iat: 1536134993, exp: 4698374993 }
```

------

### RS256算法
- 默认签发还有验证Token的时候用的是HS256算法，这种算法需要一个密钥(密码)。我们还可以使用RS256算法签发与验证JWT。这种方法可以让我们分离开签发与验证，签发时需要用一个密钥，验证时使用公钥，也就是有公钥的地方可以做验证，但是不能做签发。
- 在项目下面创建一个新的目录，里面可以存储即可将生成的密钥与公钥文件。
```
C:\projects\testWorkspace\jwt_demo>mkdir config
C:\projects\testWorkspace\jwt_demo>cd config
```
- **密钥**
- 先生成一个密钥:
```
C:\projects\testWorkspace\jwt_demo\config>ssh-keygen -t rsa -b 2048 -f private.key
```
- **公钥**
- 基于上面生成的密钥，再去创建一个对应的公钥:
```
C:\projects\testWorkspace\jwt_demo\config>openssl rsa -in private.key -pubout -outform PEM -out public.key
```
- 效果图如下:

![config][4]

------

### 签发JWT(RS256算法)
- 用RS256算法签发JWT的时候，需要从文件系统上读取创建的密钥文件里的内容。
```
const fs = require('fs')

// 获取签发 JWT 时需要用的密钥
const privateKey = fs.readFileSync('./config/private.key')
```

- 效果图:

![RS256][5]
 
- 签发仍然使用`jwt.sign`方法，只不过在选项参数里特别说明一下使用的算法是RS256:
```
// 获取验证 JWT 时需要用的公钥
const publickey = fs.readFileSync('./config/public.key')

// 验证 Token
jwt.verify(tokenRS256, publickey, (error, decoded) => {
    if (error) {
        console.log(error.message)
        return
    }
    console.log(decoded)
})

```
- 效果图:

![RS256_verify][6]

------

- 更多详细的内容可以查看JackDan的[Blog][7]。


  [1]: ./images/init.png "init.png"
  [2]: ./images/jsonwebtoken_install.png "jsonwebtoken_install.png"
  [3]: ./images/jsonwebtoken_package.png "jsonwebtoken_package.png"
  [4]: ./images/config.png "config.png"
  [5]: ./images/RS256.png "RS256.png"
  [6]: ./images/RS256_verify.png "RS256_verify.png"
  [7]: https://blog.csdn.net/XXJ19950917/article/details/82421194