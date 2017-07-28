module.exports.sendWelcomeMail = function(obj) {
    sails.hooks.email.send(
        "welcomeEmail",
        {
            name: obj.name
        },{
            to: obj.email,
            subject: "Регистрация на сайте CARIC.COM",
            from: "CARIC.COM"
        },
        function(err) {console.log(err || "Mail Sent!");}
    )
};