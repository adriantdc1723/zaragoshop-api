import { RequestHandler } from "express";

export const requestLogger: RequestHandler = (req, {}, next) => {
  const template = `
################### REQUEST-LOG #######################
path: ${req.path}
method: ${req.method}
body: ${JSON.stringify(req.body)}
date: ${new Date().toDateString()}
#######################################################
    `;
  console.log(template);
  next();
};
