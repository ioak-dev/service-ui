import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from "react";
import DomainViewer, { DomainViewerProps } from '.';
import { ACCESS_TOKEN } from '../lib/LocalTestingService';

const meta: Meta<typeof DomainViewer> = {
  title: "Composite/DomainViewer",
  component: DomainViewer,
  argTypes: {
  },
} as Meta;

export default meta;
type Story = StoryObj<typeof DomainViewer>;


const Template: Story = {
  render: (args: DomainViewerProps) => {
    return (
      <div>
        <DomainViewer {...args} />
      </div>
    );
  },
};

const props: DomainViewerProps = {
  space: "1",
  domain: "fragment",
  reference: "biI1KDAy",
  apiBaseUrl: "http://localhost:4000/api",
  authorization: {
    isAuth: true, access_token: ACCESS_TOKEN
  }
}

export const Playground = {
  ...Template, args: {
    ...props
  }
};
