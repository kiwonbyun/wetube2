import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: `비밀번호가 일치하지 않습니다.`,
    });
  }
  if (exists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: `username나 email이 중복됩니다.`,
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle: "Join", errorMessage: error._message });
  }
  return res.redirect("/login");
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log in" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Log in",
      errorMessage: "username이 존재하지 않습니다.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "Log in",
      errorMessage: "비밀번호가 틀렸습니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "5121485c86a94c4fe6c8",
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = (req, res) => {
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  console.log(config);
  return res.send("dd");
};

export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("delete user");
export const logout = (req, res) => res.send("logout user");
export const see = (req, res) => res.send("see user");
