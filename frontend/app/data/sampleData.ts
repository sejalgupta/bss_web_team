import { CourseData } from '../types'

// Sample data for local testing
// In production, this will be replaced with data from Supabase
export const sampleCourseData: CourseData = {
  units: [
    {
      name: "Why I created this course.",
      description: "Why I created this course.",
      lessons: [
        {
          id: 1,
          title: "Lesson 1",
          description: "Introduction to the course and overview of key concepts",
          metadata: "Subject: Math • Audience: Middle • Level: Developing",
          duration: "6:30",
          icon: "rocket",
          lessonPlanUrl: "/lessons/1/plan",
          pptxUrl: "/lessons/1/pptx"
        },
        {
          id: 2,
          title: "Lesson 2",
          description: "Getting started with foundational principles and practice exercises",
          metadata: "Subject: Science • Audience: Elementary • Level: Applied",
          duration: "4:40",
          icon: "target",
          lessonPlanUrl: "/lessons/2/plan",
          pptxUrl: "/lessons/2/pptx"
        },
        {
          id: 3,
          title: "Lesson 3",
          description: "Core concepts and advanced understanding",
          metadata: "Subject: Math • Audience: High • Level: Foundational",
          duration: "6:20",
          icon: "plant",
          progress: 50,
          lessonPlanUrl: "/lessons/3/plan",
          pptxUrl: "/lessons/3/pptx"
        }
      ]
    },
    {
      name: "Learn the basics first or fail on the long run.",
      description: "Learn the basics first or fail on the long run.",
      lessons: [
        {
          id: 4,
          title: "Lesson 4",
          description: "Fundamentals and core principles for building a strong foundation",
          metadata: "Subject: Science • Audience: Middle • Level: Developing",
          duration: "7:23",
          icon: "globe",
          lessonPlanUrl: "/lessons/4/plan",
          pptxUrl: "/lessons/4/pptx"
        },
        {
          id: 5,
          title: "Lesson 5",
          description: "Building blocks of understanding with practical applications",
          metadata: "Subject: Math • Audience: Elementary • Level: Applied",
          duration: "6:30",
          icon: "user",
          lessonPlanUrl: "/lessons/5/plan",
          pptxUrl: "/lessons/5/pptx"
        },
        {
          id: 6,
          title: "Lesson 6",
          description: "Practice exercises to reinforce learning and build confidence",
          metadata: "Subject: Science • Audience: High • Level: Transformational",
          duration: "8:12",
          icon: "tool",
          lessonPlanUrl: "/lessons/6/plan",
          pptxUrl: "/lessons/6/pptx"
        },
        {
          id: 7,
          title: "Lesson 7",
          description: "Advanced techniques for mastery and deeper understanding",
          metadata: "Subject: Math • Audience: Middle • Level: Foundational",
          duration: "3:10",
          icon: "eye",
          progress: 50,
          lessonPlanUrl: "/lessons/7/plan",
          pptxUrl: "/lessons/7/pptx"
        }
      ]
    },
    {
      name: "Let's build some nice stuff.",
      description: "Let's build some nice stuff.",
      lessons: [
        {
          id: 8,
          title: "Lesson 8",
          description: "Project setup and initial configuration for success",
          metadata: "Subject: Technology • Audience: High • Level: Applied",
          duration: "7:23",
          icon: "broadcast",
          lessonPlanUrl: "/lessons/8/plan",
          pptxUrl: "/lessons/8/pptx"
        },
        {
          id: 9,
          title: "Lesson 9",
          description: "Implementation strategies and best practices",
          metadata: "Subject: Science • Audience: Middle • Level: Transformational",
          duration: "6:30",
          icon: "card",
          lessonPlanUrl: "/lessons/9/plan",
          pptxUrl: "/lessons/9/pptx"
        },
        {
          id: 10,
          title: "Lesson 10",
          description: "Final touches and refinement for excellence",
          metadata: "Subject: Math • Audience: High • Level: Foundational",
          duration: "8:12",
          icon: "hourglass",
          lessonPlanUrl: "/lessons/10/plan",
          pptxUrl: "/lessons/10/pptx"
        }
      ]
    }
  ]
}
