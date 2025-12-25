
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { LocalizedContent } from './types';

export const initialContent: LocalizedContent = {
  en: {
    ui: {
      nav: {
        about: "About",
        experience: "Experience",
        expertise: "Expertise",
        contact: "Contact",
        admin: "Login"
      },
      headings: {
        keyAchievements: "Key Achievements",
        technicalExpertise: "Technical Expertise",
        expertiseSubtitle: "20+ Years of hands-on and managerial experience.",
        credentials: "Credentials",
        education: "Education",
        educationSubtitle: "Continuous learning and professional validation.",
        teaching: "Teaching Experience",
        contact: "Ready to Collaborate?",
        contactSubtitle: "Available for consulting, speaking engagements, and senior leadership roles."
      },
      footer: {
        rights: "All rights reserved."
      }
    },
    hero: {
      name: "Robin Hsu",
      nameZh: "", // Removed Chinese characters for EN version
      experienceBadge: "20+ Years in Software & Tech Industry",
      title: "E-commerce Director | CIO | HR VP | RD Manager",
      subtitle: "Business Mindset | Digital Transformation | Tech Background",
      cta: "View Work"
    },
    about: {
      title: "Architecture & Strategy",
      quote: "Standardization before Systematization.",
      summary: "With over two decades of experience in the software industry, I specialize in building and managing agile development teams and executing comprehensive technical roadmaps.",
      points: [
        "Horizontal Integration of Web/App, POS, CRM, EIS, and ERP systems.",
        "10+ years experience on both Client (甲方) and Vendor (乙方) sides.",
        "Expert in Cloud Solutions & Technical Debt Resolution.",
        "Successful migration of core financial systems."
      ]
    },
    metrics: [
      { label: "Digitization & Optimization", value: "100M", suffix: "+ NTD/Yr", desc: "Optimized one-click logistics & automated processes", progress: 99 },
      { label: "Efficiency Boost", value: "200", suffix: "%", desc: "ERP Finance module process automation", progress: 95 },
      { label: "Team Growth", value: "80", suffix: "+", desc: "Managed large-scale R&D teams across regions", progress: 85 },
      { label: "IT Cost Savings", value: "40", suffix: "%", desc: "SRE Implementation & Cloud Optimization", progress: 80 }
    ],
    skills: [
      { name: "Cloud & Database", skills: ["Amazon Web Services (AWS)", "Google Cloud Platform (GCP)", "Oracle Cloud Infrastructure (OCI)", "ERP (Oracle NetSuite)", "CRM (salesforce)", "MS-SQL", "MySQL", "Oracle DB", "CRM/POS Integration"] },
      { name: "AI Tools & Systems", skills: ["RPA (PowerAutomate)", "Google AI Ecosystem", "LCDP (OutSystems)", "NotebookLM", "Notion AI"] },
      { name: "Development", skills: ["C#.NET", "React.js", "Node.js", "React Native", "ASP.NET Core"] },
      { name: "Leadership", skills: ["Team Building (80+)", "Agile/Scrum", "Strategic Planning", "Digital Transformation", "Cross-functional Integration"] }
    ],
    experience: {
      title: "Experience",
      subtitle: "Career Trajectory",
      items: [
        {
          id: "91app",
          company: "91APP",
          role: "Director / Product Development",
          period: "2022 - Present",
          highlights: [
            "Led digital transformation and internal system reconstruction.",
            "Implemented Oracle NetSuite ERP: Efficiency +200%.",
            "AI Integration: Introduced RPA reducing listing costs by 80%.",
            "Inventory Management: Optimized cross-platform allocation."
          ],
          stack: "Digital Transformation, ERP Implementation, AI Integration, Org Management"
        },
        {
          id: "eztable",
          company: "EZTABLE",
          role: "VP of Technology & Talent",
          period: "2020 - 2022",
          highlights: [
            "Rebuilt group operations and systems. Managed 20+ IT staff.",
            "Optimized Online Booking: Adopted AWS solutions.",
            "SRE Implementation: Reduced IT costs by 40%.",
            "B2B Backend: Solved high-traffic paralysis."
          ],
          stack: "React Native, React.js, Node.JS, AWS, Org Re-structuring"
        },
        {
          id: "tutorabc",
          company: "TutorABC",
          role: "Senior R&D Manager",
          period: "2014 - 2021",
          highlights: [
            "Resolved technical debt and refactored core products, driving double-digit revenue growth.",
            "Restructured R&D teams and integrated cloud solutions, reducing IT costs by 40%.",
            "Implemented Agile management to increase resource transparency and operational efficiency by 50%.",
            "Identified user pain points on-site and remapped processes to digitize offline operations."
          ],
          stack: "Technical Debt Resolution, Cloud Integration, Agile Management, Org Restructuring"
        }
      ]
    },
    education: [
      {
        school: "Tamkang University",
        degree: "M.B.A. (Master of Business Administration), Management Information Systems",
        note: "Master Thesis Award of International Conference on Information Management (ICIM)"
      },
      {
        school: "National Sun Yat-Sen University",
        degree: "EMBA Master Credit Class, Institute of Human Resource Management",
        note: "People Management and People Development"
      }
    ],
    teaching: [
      {
        role: "Lecturer",
        school: "Tamkang University",
        period: "Feb 2021 - Sep 2022",
        location: "Taiwan",
        subject: "Presentation Skills"
      }
    ],
    contact: {
      title: "Business Mindset | Digital Transformation | Tech Background",
      subtitle: "Available for consulting, speaking engagements, and senior leadership roles.",
      emailBtn: "Cafe Chat"
    }
  },
  zh: {
    ui: {
      nav: {
        about: "關於我",
        experience: "經歷",
        expertise: "專業技能",
        contact: "聯絡資訊",
        admin: "登入"
      },
      headings: {
        keyAchievements: "主要成就",
        technicalExpertise: "技術專長",
        expertiseSubtitle: "20 年以上實戰與管理經驗",
        credentials: "專業證照",
        education: "學歷",
        educationSubtitle: "持續進修與專業認證",
        teaching: "教學經歷",
        contact: "準備好合作了嗎？",
        contactSubtitle: "提供顧問諮詢、演講邀約及高階管理職務洽談。"
      },
      footer: {
        rights: "版權所有"
      }
    },
    hero: {
      name: "Robin Hsu",
      nameZh: "徐秉暉",
      experienceBadge: "20+ 年軟體科技與資訊產業經驗",
      title: "電商總監 | CIO | HR VP | RD Manager",
      subtitle: "商業思維 | 數位轉型 | 技術背景",
      cta: "查看經歷"
    },
    about: {
      title: "架構與策略",
      quote: "先標準化，才系統化。",
      summary: "擁有超過20年的軟體產業經驗，擅長建置與管理敏捷開發團隊，並制定執行完整的技術藍圖。",
      points: [
        "橫向整合 CRM、Fin-Tech、BPM 至 ERP 等全架構系統。",
        "甲／乙方各十年實戰經驗，精準找出企業最佳資訊解決方案", // No period
        "擅長處理技術債與雲端架構優化。",
        "成功遷移企業核心財務系統，順利切換無縫接軌。"
      ]
    },
    metrics: [
      { label: "電子化、流程優化", value: "1億", suffix: "+ 年省", desc: "優化一鍵寄送與自動化流程", progress: 99 },
      { label: "效率提升", value: "200", suffix: "%", desc: "ERP 財務模組流程自動化", progress: 95 },
      { label: "團隊成長", value: "80", suffix: "+", desc: "管理跨區域大型研發團隊", progress: 85 },
      { label: "IT 成本節省", value: "40", suffix: "%", desc: "SRE 導入與雲端優化", progress: 80 }
    ],
    skills: [
      { name: "Cloud & Database", skills: ["Amazon Web Services (AWS)", "Google Cloud Platform (GCP)", "Oracle Cloud Infrastructure (OCI)", "ERP (Oracle NetSuite)", "CRM (salesforce)", "MS-SQL", "MySQL", "Oracle DB", "CRM/POS Integration"] },
      { name: "AI Tools & Systems", skills: ["RPA (PowerAutomate)", "Google AI 生態圈", "LCDP (OutSystems)", "NotebookLM", "Notion AI"] },
      { name: "軟體開發", skills: ["C#.NET", "React.js", "Node.js", "React Native", "ASP.NET Core"] },
      { name: "領導力", skills: ["團隊建立 (80+人)", "敏捷開發/Scrum", "策略規劃", "數位轉型", "跨部門整合"] }
    ],
    experience: {
      title: "經歷",
      subtitle: "職涯歷程",
      items: [
        {
          id: "91app",
          company: "91APP",
          role: "總監 / 產品發展處",
          period: "2022 - Present",
          highlights: [
            "主導數位轉型與內部系統重建。",
            "導入 Oracle NetSuite ERP：效率提升 200%。",
            "AI 導入：RPA 降低上架成本 80%，智能客服提升效率 50%。",
            "庫存管理：優化多平台配貨 (Momo, 蝦皮等)。"
          ],
          stack: "數位轉型, ERP 導入, AI 整合, 組織管理"
        },
        {
          id: "eztable",
          company: "EZTABLE",
          role: "技術暨人才副總",
          period: "2020 - 2022",
          highlights: [
            "重建集團營運與系統。管理 20+ IT 人員。",
            "優化線上訂位：導入 AWS 解決方案，解決技術債。",
            "SRE 導入：IT 費用節省 40%，維運節省 100%。",
            "B2B 後台：解決高流量系統癱瘓問題。"
          ],
          stack: "React Native, React.js, Node.JS, AWS, 組織重整"
        },
        {
          id: "tutorabc",
          company: "TutorABC",
          role: "Senior R&D Manager",
          period: "2014 - 2021",
          highlights: [
            "解決技術債，重製核心產品，推動營收雙位數成長。",
            "重組研發團隊，整合雲端解決方案，IT整體費用節省40%。",
            "敏捷管理，讓研發資源透明，大幅提升維運效率50%。",
            "駐點使用單位找痛點，重編流程地圖，大量數位化線下作業。"
          ],
          stack: "技術債解決, 雲端整合, 敏捷管理, 組織重整"
        }
      ]
    },
    education: [
      {
        school: "淡江大學",
        degree: "資訊管理研究所 碩士 (MBA)",
        note: "ICIM 國際資訊管理研討會 碩士論文獎"
      },
      {
        school: "國立中山大學",
        degree: "人力資源管理研究所 EMBA 學分班",
        note: "人員管理與發展 (People Management and People Development)"
      }
    ],
    teaching: [
      {
        role: "講師 (Lecturer)",
        school: "淡江大學 (Tamkang University)",
        period: "2021年2月 - 2022年9月",
        location: "台灣",
        subject: "簡報技巧 (Presentation Skills)"
      }
    ],
    contact: {
      title: "商業思維 | 數位轉型 | 技術背景",
      subtitle: "提供顧問諮詢、演講邀約及高階管理職務洽談。",
      emailBtn: "約我喝一杯咖啡"
    }
  }
};
