import { serverConfig } from "../config";

export const workspaceJoinMail = function (workspaceName: string) {
  return {
    from: serverConfig.MAIL_ID,
    subject: "You have been added to workspace",
    text: `Congratulations! You have been added to workspace ${workspaceName}`,
  };
};
