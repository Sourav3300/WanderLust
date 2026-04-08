const User = require("../passport");

module.exports.renderSingUp = (req,res)=>{
  res.render("users/user")
};

module.exports.signUp = async (req,res,next)=>{


  try{
     let {username,email,password} = req.body;
     let user1 = new  User({
    username,
    email
  })

  let registerUser = await User.register(user1,password);
  req.login(registerUser , (err)=>{
    if(err){
      return next();
    };
     req.flash("success", "Welcome to WanderLust");
     res.redirect("/listings")
  })
 
  }
  catch(err){
    next(err);
  }
}

module.exports.renderLogIn = (req,res)=>{
res.render("users/login");
};

module.exports.logIn = (req,res)=>{
    req.flash("success","Welcome to WanderLust");
    let redirectUrl =  res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

module.exports.logOut = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You are logged out");
    res.redirect("/listings")
  })
};