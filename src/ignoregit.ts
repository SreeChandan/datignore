"use strict"

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export enum IgnoreType
{
    File,
    Extension,
    Folder
}

export class IgnoreGit
{
    private gitIgnoreFile: string;
    public IsGitIgnorePresent(): boolean
    {
        return fs.existsSync(this.gitIgnoreFile);
    }
    public AddExtension(file: string, type: IgnoreType): boolean
    {
        let content = this.ReadGitFile();
        let myStrings = content.split('\n');

        if (this.IsPresent("*" + path.extname(file), myStrings) > -1)
            return true;
        myStrings[myStrings.length] = "*" + path.extname(file);
        return this.WriteGitFile(myStrings);
    }
    public RemoveExtension(file: string): boolean
    {
        let content = this.ReadGitFile();
        let myStrings = content.split('\n');
        let position = this.IsPresent("*" + path.extname(file), myStrings);
        if (position <= -1)
            return true;
        else
        {
            myStrings.splice(position, 1);
            return this.WriteGitFile(myStrings);
        }
    }
    public AddFile(file: string, type: IgnoreType): boolean
    {
        let content = this.ReadGitFile();
        let myStrings = content.split('\n');
        if (this.IsPresent(file.replace(/\\/g, "/").substring(1), myStrings) > -1)
            return true;
        myStrings[myStrings.length] = file.replace(/\\/g, "/").substring(1);
        return this.WriteGitFile(myStrings);
    }
    public RemoveFile(file: string): boolean
    {
        let content = this.ReadGitFile();
        let myStrings = content.split('\n');
        let position = this.IsPresent(file.replace(/\\/g, "/").substring(1), myStrings);
        if (position <= -1)
            return true;
        else
        {
            myStrings.splice(position, 1);
            return this.WriteGitFile(myStrings);
        }
    }
    private ReadGitFile(): string
    {
        if (this.IsGitIgnorePresent())
        {
            return fs.readFileSync(this.gitIgnoreFile, "utf8");
        }
        else
            return null;
    }
    private WriteGitFile(content: Array<string>): boolean
    {
        if (this.IsGitIgnorePresent())
        {
            let newContent = content.join('\n');
            fs.unlinkSync(this.gitIgnoreFile);
            fs.writeFileSync(this.gitIgnoreFile, newContent);
            return true;
        }
        else
            return false;
    }
    private IsPresent(file: string, content: Array<string>): number
    {
        let result: number = -1;
        content.forEach((element, i) =>
        {
            if (element.replace("\r", "").replace("\n", "") === file)
                result = i;
        });
        return result;
    }
    constructor()
    {
        this.gitIgnoreFile = (vscode.workspace.rootPath + "/.gitignore").replace(/\\/g, "/");
    }
}