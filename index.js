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

// 验证 Token
jwt.verify(token, secret, (error, decoded) => {
    if (error) {
        console.log(error.message)
        return
    }
    console.log(decoded)
})

const fs = require('fs')

// 获取签发 JWT 时需要用的密钥
const privateKey = fs.readFileSync('./config/private.key')

// 签发Token
const tokenRS256 = jwt.sign(payload, privateKey, { algorithm: 'RS256' })

// 输出签发的Token
console.log('RS256 算法: ', tokenRS256)

// 获取验证 JWT 时需要用的公钥
const publickey = fs.readFileSync('./config/public.key')

// 验证 Token
jwt.verify(tokenRS256, publickey, (error, decoded) => {
    if (error) {
        console.log(error.message)
        return
    }
    console.log('RS256 算法: ', decoded)
})
