const {app}=require('./app/app.js')

const PORT=process.env.PORT||2264

app.listen(PORT,err=>err?console.log(err):console.log(`http://localhost:${PORT}`))
