import Link from "next/link";
import { Link as MuiLink } from "@mui/material"
import React from "react";
const MuiNextLink: React.FC<{ children?: React.ReactNode, href: string }> = (props) => {
    return (
        <Link href={props.href}>
            <MuiLink href={props.href}>{props.children}</MuiLink>
        </Link >
    )
}

export default MuiNextLink;