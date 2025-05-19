'use client'

import CompletelyNewLayoutV2 from './completely_new_layout_v2'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This is version 2 with red sidebar
  return <CompletelyNewLayoutV2>{children}</CompletelyNewLayoutV2>
}
