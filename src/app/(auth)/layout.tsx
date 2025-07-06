interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      {children}
    </div>
  );
}
