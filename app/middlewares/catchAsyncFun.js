module.exports = (thefunc)=>(req,res,next)=>{
    Promise.resolve(thefunc(req,res,next)).catch(next);
    // console.log(Promise.resolve(thefunc(req,res,next)).catch(next))
};