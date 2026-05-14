use axum::{
    extract::Query,
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use scraper::{Html, Selector};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing_subscriber::{fmt, prelude::*, EnvFilter};

#[derive(Debug, Serialize, Deserialize)]
struct Repo {
    owner: String,
    name: String,
    description: String,
    language: String,
    stars: String,
    forks: String,
    stars_gained: String,
    avatar: String,
}

#[derive(Deserialize)]
struct TrendingQuery {
    since: Option<String>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .init();

    let app = Router::new()
        .route("/api/trending", get(get_trending))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([127, 0, 0, 1], 4001));
    tracing::info!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_trending(Query(params): Query<TrendingQuery>) -> impl IntoResponse {
    let since = params.since.unwrap_or_else(|| "daily".to_string());
    match scrape_trending(&since).await {
        Ok(repos) => (StatusCode::OK, Json(repos)).into_response(),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Error scraping: {}", e),
        )
            .into_response(),
    }
}

async fn scrape_trending(since: &str) -> Result<Vec<Repo>, Box<dyn std::error::Error>> {
    let url = format!("https://github.com/trending?since={}", since);
    let response = reqwest::get(url).await?.text().await?;
    let document = Html::parse_document(&response);

    let row_selector = Selector::parse("article.Box-row").unwrap();
    let title_selector = Selector::parse("h2.h3 a").unwrap();
    let desc_selector = Selector::parse("p.col-9").unwrap();
    let lang_selector = Selector::parse("span[itemprop='programmingLanguage']").unwrap();
    let stars_forks_selector = Selector::parse("a.Link--muted.d-inline-block.mr-3").unwrap();
    let stars_gained_selector = Selector::parse("span.d-inline-block.float-sm-right").unwrap();
    let avatar_selector = Selector::parse("img.avatar.mb-1.avatar-user").unwrap();

    let mut repos = Vec::new();

    for row in document.select(&row_selector) {
        let title_element = row.select(&title_selector).next();
        let (owner, name) = if let Some(el) = title_element {
            let full_name = el.text().collect::<String>().replace(" ", "").replace("\n", "");
            let parts: Vec<&str> = full_name.split('/').collect();
            if parts.len() == 2 {
                (parts[0].to_string(), parts[1].to_string())
            } else {
                ("".to_string(), full_name)
            }
        } else {
            ("".to_string(), "".to_string())
        };

        let description = row
            .select(&desc_selector)
            .next()
            .map(|el| el.text().collect::<String>().trim().to_string())
            .unwrap_or_default();

        let language = row
            .select(&lang_selector)
            .next()
            .map(|el| el.text().collect::<String>().trim().to_string())
            .unwrap_or_else(|| "Unknown".to_string());

        let mut stars_forks = row.select(&stars_forks_selector);
        let stars = stars_forks
            .next()
            .map(|el| el.text().collect::<String>().trim().to_string())
            .unwrap_or_default();
        let forks = stars_forks
            .next()
            .map(|el| el.text().collect::<String>().trim().to_string())
            .unwrap_or_default();

        let stars_gained = row
            .select(&stars_gained_selector)
            .next()
            .map(|el| el.text().collect::<String>().trim().to_string())
            .unwrap_or_default();

        let avatar = row
            .select(&avatar_selector)
            .next()
            .and_then(|el| el.value().attr("src"))
            .map(|s| s.to_string())
            .unwrap_or_default();

        repos.push(Repo {
            owner,
            name,
            description,
            language,
            stars,
            forks,
            stars_gained,
            avatar,
        });
    }

    Ok(repos)
}
